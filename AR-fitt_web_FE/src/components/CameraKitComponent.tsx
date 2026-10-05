// src/components/CameraKitComponent.tsx

import React, { useEffect, useRef, useState } from "react";
import {
    bootstrapCameraKit,
    CameraKit,
    ConcatInjectable,
    createMediaStreamSource,
    lensSourcesFactory,
    Transform2D,
} from "@snap/camera-kit";
import { getCameraKitUserAgent } from "@snap/camera-kit/utils";

interface CameraKitComponentProps {
    lensId: string;
    lensGroupId?: string;
}

const FIXED_WIDTH = 640;
const FIXED_HEIGHT = 480;
const HOSTED_LENS_GROUP_ID = "hosted-lenses";
const apiToken = process.env.REACT_APP_CAMERA_KIT_API_TOKEN || "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQwMjcwOTI3LCJzdWIiOiJhYzBkYTlmYy0zOTEwLTQ3OTQtOWQxNi04M2Q5YTFjZTI5Yjd-U1RBR0lOR342MTc1Zjg3Yy0xODYyLTQwY2EtOWFlMi05M2MzZWZjYTdjMjkifQ.m8J0BZ8orqSb_NN_99xz3D31QTkWcLB2dGFKufL8HUs";

// Lenses may live in either group; the first group containing the lens wins.
const LENS_GROUP_IDS = (
    process.env.REACT_APP_CAMERA_KIT_LENS_GROUP_IDS ??
    "26ca79ed-d8e4-404f-af7f-027c6c98fa04,da397668-4e71-4116-ad9f-bb9c0f7dc687"
)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

const encodeVarint = (value: number): number[] => {
    const bytes: number[] = [];
    let remaining = value;
    while (remaining > 0x7f) {
        bytes.push((remaining & 0x7f) | 0x80);
        remaining = Math.floor(remaining / 128);
    }
    bytes.push(remaining);
    return bytes;
};

const readVarint = (bytes: Uint8Array, start: number) => {
    let value = 0;
    let shift = 0;
    let offset = start;
    while (offset < bytes.length) {
        const byte = bytes[offset++];
        value += (byte & 0x7f) * 2 ** shift;
        if ((byte & 0x80) === 0) return { value, offset };
        shift += 7;
    }
    throw new Error("Malformed Snap hosted-lens response.");
};

const getEnvelopeBytes = (message: Uint8Array): Uint8Array | null => {
    let offset = 0;
    while (offset < message.length) {
        const tag = readVarint(message, offset);
        offset = tag.offset;
        const fieldNumber = tag.value >>> 3;
        const wireType = tag.value & 7;
        if (wireType === 2) {
            const length = readVarint(message, offset);
            offset = length.offset;
            const end = offset + length.value;
            if (end > message.length) throw new Error("Malformed Snap hosted-lens response.");
            if (fieldNumber === 1) return message.subarray(offset, end);
            offset = end;
        } else if (wireType === 0) {
            offset = readVarint(message, offset).offset;
        } else if (wireType === 1) {
            offset += 8;
        } else if (wireType === 5) {
            offset += 4;
        } else {
            throw new Error("Unsupported Snap hosted-lens response format.");
        }
    }
    return null;
};

const loadHostedLensEnvelope = async (reference: string): Promise<ArrayBuffer> => {
    const referenceBytes = new TextEncoder().encode(reference);
    const requestMessage = new Uint8Array([
        0x0a,
        ...encodeVarint(referenceBytes.length),
        ...Array.from(referenceBytes),
    ]);
    const requestFrame = new Uint8Array(5 + requestMessage.length);
    requestFrame[0] = 0;
    new DataView(requestFrame.buffer).setUint32(1, requestMessage.length, false);
    requestFrame.set(requestMessage, 5);

    const response = await fetch(
        "https://camera-kit-api.snapar.com/com.snap.camerakit.v3.HostedLenses/GetLensByHostedReference",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/grpc-web+proto",
                "x-grpc-web": "1",
                "x-snap-client-user-agent": getCameraKitUserAgent(),
            },
            body: requestFrame,
        }
    );
    if (!response.ok) throw new Error(`Snap hosted-lens request failed (HTTP ${response.status}).`);

    const bytes = new Uint8Array(await response.arrayBuffer());
    let offset = 0;
    let grpcStatus = response.headers.get("grpc-status");
    let grpcMessage = response.headers.get("grpc-message");
    let envelope: Uint8Array | null = null;

    while (offset + 5 <= bytes.length) {
        const flags = bytes[offset];
        const frameLength = new DataView(bytes.buffer, bytes.byteOffset + offset + 1, 4).getUint32(0, false);
        offset += 5;
        const frameEnd = offset + frameLength;
        if (frameEnd > bytes.length) throw new Error("Malformed Snap hosted-lens response.");
        const frame = bytes.subarray(offset, frameEnd);
        offset = frameEnd;

        if ((flags & 0x80) !== 0) {
            const trailers = new TextDecoder().decode(frame);
            for (const line of trailers.split(/\r?\n/)) {
                const separator = line.indexOf(":");
                if (separator < 0) continue;
                const key = line.slice(0, separator).trim().toLowerCase();
                const value = line.slice(separator + 1).trim();
                if (key === "grpc-status") grpcStatus = value;
                if (key === "grpc-message") grpcMessage = value;
            }
        } else {
            envelope = getEnvelopeBytes(frame);
        }
    }

    if (grpcStatus && grpcStatus !== "0") {
        const message = grpcMessage ? decodeURIComponent(grpcMessage) : "Snap could not load this hosted lens.";
        throw new Error(`${message} (gRPC ${grpcStatus})`);
    }
    if (!envelope?.length) throw new Error("Snap returned no lens data for this hosted experience.");
    return envelope.buffer.slice(envelope.byteOffset, envelope.byteOffset + envelope.byteLength);
};

const hostedLensSource = {
    isGroupOwner: (groupId: string) => groupId === HOSTED_LENS_GROUP_ID,
    loadLens: (reference: string, groupId: string) => {
        if (groupId !== HOSTED_LENS_GROUP_ID) {
            return Promise.reject(new Error("Unsupported Snap hosted-lens group."));
        }
        return loadHostedLensEnvelope(reference);
    },
    loadLensGroup: () => Promise.resolve(new ArrayBuffer(0)),
};

const loadLensFromGroups = async (cameraKit: CameraKit, lensId: string, requestedGroupId?: string) => {
    let lastError: unknown;
    const groupIds = requestedGroupId ? [requestedGroupId] : LENS_GROUP_IDS;
    for (const groupId of groupIds) {
        try {
            return await cameraKit.lensRepository.loadLens(lensId, groupId);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError;
};

const CameraKitComponent: React.FC<CameraKitComponentProps> = ({ lensId, lensGroupId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorDetail, setErrorDetail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let session: any;
        let stream: MediaStream | undefined;
        let disposed = false;
        setErrorMessage(null);
        setErrorDetail(null);
        setLoading(true);

        const runCameraKit = async () => {
            if (!canvasRef.current) return;

            canvasRef.current.width = FIXED_WIDTH;
            canvasRef.current.height = FIXED_HEIGHT;

            try {
                if (!lensId || lensId.includes("/")) {
                    throw new Error("This product does not have a Camera Kit Lens ID.");
                }
                const cameraKit = await bootstrapCameraKit({ apiToken }, (container) =>
                    container.provides(
                        ConcatInjectable(lensSourcesFactory.token, () => hostedLensSource)
                    )
                );
                if (disposed) return;
                session = await cameraKit.createSession({ liveRenderTarget: canvasRef.current });
                if (disposed) return;

                session.events.addEventListener("error", (event: any) => {
                    if (event.detail.error.name === "LensExecutionError") {
                        console.error("Camera Kit lens execution failed:", event.detail.error);
                        if (!disposed) setErrorMessage("The lens could not start. Please try again later.");
                    }
                });

                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (disposed) return;
                const source = createMediaStreamSource(stream, { transform: Transform2D.MirrorX, cameraType: "user" });
                await session.setSource(source);

                const lens = await loadLensFromGroups(cameraKit, lensId, lensGroupId);
                if (disposed) return;
                await session.applyLens(lens);
                await session.play();
                if (!disposed) setLoading(false);
            } catch (error) {
                console.error("Error initializing CameraKit:", error);
                if (!disposed) {
                    setLoading(false);
                    setErrorDetail(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
                    setErrorMessage(
                        error instanceof DOMException && error.name === "NotAllowedError"
                            ? "Allow camera access to try this item on."
                            : "The lens could not load. Please try again later."
                    );
                }
            } finally {
                if (disposed) {
                    stream?.getTracks().forEach((track) => track.stop());
                    stream = undefined;
                    session?.destroy();
                    session = undefined;
                }
            }
        };

        void runCameraKit();

        return () => {
            disposed = true;
            stream?.getTracks().forEach((track) => track.stop());
            stream = undefined;
            session?.destroy();
            session = undefined;
        };
    }, [lensId, lensGroupId]);

    return (
        <div className="relative w-full" style={{ maxWidth: FIXED_WIDTH, margin: "0 auto" }}>
            <canvas
                ref={canvasRef}
                style={{ display: "block", width: "100%", aspectRatio: `${FIXED_WIDTH} / ${FIXED_HEIGHT}` }}
            />
            {(loading || errorMessage) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-8 text-center" role="status">
                    <div className="flex flex-col items-center gap-2">
                        <span>{errorMessage ?? "Loading try on…"}</span>
                        {errorDetail && <span className="text-xs text-gray-400 break-all">{errorDetail}</span>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraKitComponent;

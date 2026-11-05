// src/components/CameraKitComponent.tsx

import React, { useEffect, useRef, useState } from "react";
import {
    bootstrapCameraKit,
    CameraKit,
    CameraKitSession,
    ConcatInjectable,
    createMediaStreamSource,
    findLensScriptError,
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
const MAX_CAMERA_DIMENSION = 640;
const CAMERA_FPS = 24;
const HOSTED_LENS_GROUP_ID = "hosted-lenses";
const apiToken = process.env.REACT_APP_CAMERA_KIT_API_TOKEN?.trim();
// The deployed site proxies these requests to Snap to avoid cross-origin transport failures.
const apiHostname = process.env.REACT_APP_CAMERA_KIT_API_HOSTNAME || "camera-kit-api.snapar.com";

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
        `https://${apiHostname}/com.snap.camerakit.v3.HostedLenses/GetLensByHostedReference`,
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
    const [attempt, setAttempt] = useState(0);
    const teardownRef = useRef<Promise<void>>(Promise.resolve());

    useEffect(() => {
        let cameraKit: CameraKit | undefined;
        let session: CameraKitSession | undefined;
        let stream: MediaStream | undefined;
        let disposed = false;
        let failed = false;
        const previousTeardown = teardownRef.current;
        const canvas = canvasRef.current;
        setErrorMessage(null);
        setErrorDetail(null);
        setLoading(true);

        const releaseResources = async () => {
            stream?.getTracks().forEach((track) => track.stop());
            stream = undefined;
            const kit = cameraKit;
            cameraKit = undefined;
            session = undefined;
            if (kit) {
                try { await kit.destroy(); }
                catch (error) { console.error("Error releasing Camera Kit:", error); }
            }
        };

        const showError = (error: unknown, message: string) => {
            if (disposed || failed) return;
            failed = true;
            const scriptError = findLensScriptError(error);
            const detail = scriptError?.stack || (error instanceof Error ? `${error.name}: ${error.message}` : String(error));
            console.error("Camera Kit try-on failed:", { lensId, lensGroupId, error, scriptError });
            setLoading(false);
            setErrorDetail(detail);
            setErrorMessage(message);
        };

        const onContextLost = (event: Event) => {
            event.preventDefault();
            showError(new Error("WebGL context lost while rendering the lens."), "The camera preview stopped. Tap Retry to restart.");
            teardownRef.current = initialization.then(releaseResources);
        };
        canvas?.addEventListener("webglcontextlost", onContextLost);

        const runCameraKit = async () => {
            await previousTeardown;
            if (!canvas || disposed) return;

            canvas.width = FIXED_WIDTH;
            canvas.height = FIXED_HEIGHT;

            try {
                if (!lensId || lensId.includes("/")) {
                    throw new Error("This product does not have a Camera Kit Lens ID.");
                }
                if (!apiToken) {
                    throw new Error("Camera Kit API token is not configured.");
                }
                // Keep the API host explicit so the SDK and custom hosted-lens loader use the same endpoint.
                const cameraKitConfiguration = { apiToken, apiHostname };
                cameraKit = await bootstrapCameraKit(cameraKitConfiguration, (container) =>
                    container.provides(
                        ConcatInjectable(lensSourcesFactory.token, () => hostedLensSource)
                    )
                );
                if (disposed || failed) return;
                session = await cameraKit.createSession({ liveRenderTarget: canvas });
                if (disposed || failed) return;

                session.events.addEventListener("error", ({ detail }) => {
                    if (detail.error.name === "LensExecutionError" || detail.error.name === "LensAbortError") {
                        showError(detail.error, "This try-on stopped while rendering. Tap Retry to restart.");
                        teardownRef.current = initialization.then(releaseResources);
                    }
                });

                // Canvas CSS does not limit Lens Core's input resolution or processing load.
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: { ideal: "user" },
                        width: { ideal: FIXED_WIDTH, max: MAX_CAMERA_DIMENSION },
                        height: { ideal: FIXED_HEIGHT, max: MAX_CAMERA_DIMENSION },
                        frameRate: { ideal: CAMERA_FPS, max: 30 },
                    },
                });
                if (disposed || failed) return;
                const source = createMediaStreamSource(stream, {
                    transform: Transform2D.MirrorX, cameraType: "user", fpsLimit: CAMERA_FPS,
                });
                await session.setSource(source);
                if (disposed || failed) return;
                // Keep matchInputResolution enabled. Mobile camera dimensions can be
                // temporarily incorrect; an explicit render size disables SDK correction.

                const lens = await loadLensFromGroups(cameraKit, lensId, lensGroupId);
                if (disposed || failed) return;
                await session.applyLens(lens);
                if (disposed || failed) return;
                await session.play();
                if (!disposed && !failed) setLoading(false);
            } catch (error) {
                showError(error, error instanceof DOMException && error.name === "NotAllowedError"
                    ? "Allow camera access to try this item on."
                    : "The lens could not load. Tap Retry to try again.");
            } finally {
                if (disposed || failed) await releaseResources();
            }
        };

        const initialization = runCameraKit();

        return () => {
            disposed = true;
            canvas?.removeEventListener("webglcontextlost", onContextLost);
            stream?.getTracks().forEach((track) => track.stop());
            // Wait for pending SDK/camera operations before destroying their resources.
            teardownRef.current = Promise.all([initialization, teardownRef.current]).then(releaseResources);
        };
    }, [lensId, lensGroupId, attempt]);

    return (
        <div className="relative w-full" style={{ maxWidth: FIXED_WIDTH, margin: "0 auto" }}>
            <canvas
                key={`${lensId}:${lensGroupId}:${attempt}`}
                ref={canvasRef}
                style={{ display: "block", width: "100%", height: "auto", maxHeight: "85dvh", objectFit: "contain" }}
            />
            {(loading || errorMessage) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-8 text-center" role="status">
                    <div className="flex flex-col items-center gap-2">
                        <span>{errorMessage ?? "Loading try on…"}</span>
                        {errorMessage && <button type="button" className="rounded bg-white px-4 py-2 text-black" onClick={() => setAttempt((value) => value + 1)}>Retry</button>}
                        {errorDetail && <details className="max-h-32 overflow-auto text-xs text-gray-400 break-all"><summary>Error details</summary><pre className="whitespace-pre-wrap">{errorDetail}</pre></details>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraKitComponent;

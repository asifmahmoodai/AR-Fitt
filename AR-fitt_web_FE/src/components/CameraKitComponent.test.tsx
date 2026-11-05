import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { bootstrapCameraKit, createMediaStreamSource, findLensScriptError } from "@snap/camera-kit";
import CameraKitComponent from "./CameraKitComponent";

jest.mock("@snap/camera-kit", () => ({
    bootstrapCameraKit: jest.fn(),
    createMediaStreamSource: jest.fn(),
    findLensScriptError: jest.fn(),
    ConcatInjectable: jest.fn(),
    lensSourcesFactory: { token: "lensSources" },
    Transform2D: { MirrorX: "mirror" },
}));
jest.mock("@snap/camera-kit/utils", () => ({ getCameraKitUserAgent: jest.fn() }), { virtual: true });

const stop = jest.fn();
const track = { stop, getSettings: () => ({ width: 1080, height: 1920 }) };
const stream = { getTracks: () => [track], getVideoTracks: () => [track] };
const getUserMedia = jest.fn();
let events: EventTarget;
let session: { events: EventTarget; setSource: jest.Mock; applyLens: jest.Mock; play: jest.Mock };
let kit: { createSession: jest.Mock; destroy: jest.Mock; lensRepository: { loadLens: jest.Mock } };
let source: { setRenderSize: jest.Mock };

beforeEach(() => {
    process.env.REACT_APP_CAMERA_KIT_API_TOKEN = "test-token";
    jest.clearAllMocks();
    events = new EventTarget();
    session = { events, setSource: jest.fn().mockResolvedValue(undefined), applyLens: jest.fn().mockResolvedValue(undefined), play: jest.fn().mockResolvedValue(undefined) };
    kit = { createSession: jest.fn().mockResolvedValue(session), destroy: jest.fn().mockResolvedValue(undefined), lensRepository: { loadLens: jest.fn().mockResolvedValue({ id: "lens" }) } };
    source = { setRenderSize: jest.fn().mockResolvedValue(undefined) };
    (bootstrapCameraKit as jest.Mock).mockResolvedValue(kit);
    (createMediaStreamSource as jest.Mock).mockReturnValue(source);
    (findLensScriptError as jest.Mock).mockReturnValue(undefined);
    getUserMedia.mockResolvedValue(stream);
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => { jest.restoreAllMocks(); });

test("bounds camera work while preserving SDK mobile orientation correction", async () => {
    const view = render(<CameraKitComponent lensId="lens" />);
    await waitFor(() => expect(session.play).toHaveBeenCalled());
    expect(getUserMedia).toHaveBeenCalledWith(expect.objectContaining({
        audio: false,
        video: expect.objectContaining({
            facingMode: { ideal: "user" }, frameRate: { ideal: 24, max: 30 },
            width: { ideal: 640, max: 640 }, height: { ideal: 480, max: 640 },
        }),
    }));
    // getSettings() can be stale on phones. Let the SDK track input orientation.
    expect(source.setRenderSize).not.toHaveBeenCalled();
    expect(createMediaStreamSource).toHaveBeenCalledWith(stream, expect.objectContaining({ fpsLimit: 24 }));
    expect(view.container.querySelector("canvas")?.style.height).toBe("auto");
    view.unmount();
    await waitFor(() => expect(kit.destroy).toHaveBeenCalledTimes(1));
    expect(stop).toHaveBeenCalled();
});

test("surfaces body-tracking script errors, releases resources and retries with a new canvas", async () => {
    const view = render(<CameraKitComponent lensId="lens" />);
    await waitFor(() => expect(session.play).toHaveBeenCalled());
    const oldCanvas = view.container.querySelector("canvas");
    (findLensScriptError as jest.Mock).mockReturnValue({ stack: "LensScriptError: body tracker failed at Scripts/Body.js:18" });
    act(() => { events.dispatchEvent(new CustomEvent("error", { detail: { error: Object.assign(new Error("Rendering failed"), { name: "LensExecutionError" }) } })); });
    expect(screen.getByText(/body tracker failed/)).toBeTruthy();
    await waitFor(() => expect(kit.destroy).toHaveBeenCalledTimes(1));
    expect(stop).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(session.play).toHaveBeenCalledTimes(2));
    expect(view.container.querySelector("canvas")).not.toBe(oldCanvas);
});

test("handles fatal Lens Core aborts during playback", async () => {
    render(<CameraKitComponent lensId="lens" />);
    await waitFor(() => expect(session.play).toHaveBeenCalled());
    act(() => { events.dispatchEvent(new CustomEvent("error", { detail: { error: Object.assign(new Error("out of memory"), { name: "LensAbortError" }) } })); });
    expect(screen.getByText(/LensAbortError: out of memory/)).toBeTruthy();
    await waitFor(() => expect(kit.destroy).toHaveBeenCalledTimes(1));
});

test("handles a lost graphics context without leaving the camera running", async () => {
    const view = render(<CameraKitComponent lensId="lens" />);
    await waitFor(() => expect(session.play).toHaveBeenCalled());
    fireEvent(view.container.querySelector("canvas")!, new Event("webglcontextlost", { cancelable: true }));
    expect(screen.getByText(/WebGL context lost/)).toBeTruthy();
    await waitFor(() => expect(kit.destroy).toHaveBeenCalledTimes(1));
    expect(stop).toHaveBeenCalled();
});

test("waits for the old SDK teardown before retrying", async () => {
    render(<CameraKitComponent lensId="lens" />);
    await waitFor(() => expect(session.play).toHaveBeenCalled());
    let finishTeardown: () => void = () => {};
    kit.destroy.mockReturnValue(new Promise<void>((resolve) => { finishTeardown = resolve; }));
    act(() => { events.dispatchEvent(new CustomEvent("error", { detail: { error: Object.assign(new Error("Rendering failed"), { name: "LensExecutionError" }) } })); });
    await waitFor(() => expect(kit.destroy).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(bootstrapCameraKit).toHaveBeenCalledTimes(1);
    await act(async () => { finishTeardown(); });
    await waitFor(() => expect(session.play).toHaveBeenCalledTimes(2));
    kit.destroy.mockResolvedValue(undefined);
});

test("stops a camera granted after the popup is closed without applying a lens", async () => {
    let grantCamera: (value: typeof stream) => void = () => {};
    getUserMedia.mockReturnValue(new Promise((resolve) => { grantCamera = resolve; }));
    const view = render(<CameraKitComponent lensId="lens" />);
    await waitFor(() => expect(getUserMedia).toHaveBeenCalled());
    view.unmount();
    await act(async () => { grantCamera(stream); });
    expect(stop).toHaveBeenCalled();
    expect(session.applyLens).not.toHaveBeenCalled();
    expect(kit.destroy).toHaveBeenCalledTimes(1);
});

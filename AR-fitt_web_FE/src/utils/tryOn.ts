/** Validate Hosted WebAR URLs so their reference can be loaded in the try-on popup. */
export const getHostedTryOnUrl = (lensId?: string | null): string | null => {
  if (!lensId) return null;

  try {
    const url = new URL(lensId);
    if (
      url.protocol === "https:" &&
      url.hostname === "lens.snap.com" &&
      /^\/experience\/[0-9a-f-]{36}\/?$/i.test(url.pathname)
    ) {
      return url.href;
    }
  } catch {
    // Camera Kit Lens IDs are not URLs.
  }

  return null;
};

export const getHostedLensReference = (lensId?: string | null): string | null => {
  const hostedUrl = getHostedTryOnUrl(lensId);
  return hostedUrl
    ? new URL(hostedUrl).pathname.split("/").filter(Boolean)[1] ?? null
    : null;
};

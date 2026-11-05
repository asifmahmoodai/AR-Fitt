const backendBaseUrl = (process.env.REACT_APP_NODE_BACKEND_BASE_URL || '').replace(/\/+$/, '');

/** Resolve both legacy database image routes and uploaded product-image keys. */
export const getProductImageUrl = (imageUrl?: string | null): string | null => {
  const value = imageUrl?.trim();
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) return value;

  if (value.startsWith('/')) {
    return `${backendBaseUrl}${value}`;
  }

  return `${backendBaseUrl}/product_images/${encodeURIComponent(value)}`;
};

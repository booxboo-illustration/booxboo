/**
 * Generates an optimized src URL for a specific width and quality.
 */
export const getOptimizedImageUrl = (src: string, width?: number, quality = 80): string => {
  if (!src) return "";
  
  // Prevent double-optimization: if it already points to our optimization API,
  // extract the real raw path from its 'src' query parameter.
  if (src.includes("/api/image")) {
    const match = src.match(/[?&]src=([^&]+)/);
    if (match) {
      src = decodeURIComponent(match[1]);
    }
  }
  
  // Return absolute or video URLs as-is
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.toLowerCase().endsWith(".mp4") ||
    src.toLowerCase().endsWith(".mov") ||
    src.toLowerCase().endsWith(".webm")
  ) {
    return src;
  }
  
  // Normalize heading slash
  const url = src.startsWith("/") ? src : `/${src}`;
  
  return url;
};

/**
 * Returns src, srcSet, and sizes attributes for fully responsive and device-appropriate rendering.
 * Optimal width rules:
 * - Mobile: 400w
 * - Tablet/Medium content: 800w
 * - Large/Desktop viewports: 1200w and 1600w
 */
export const getResponsiveImageAttrs = (src: string, defaultWidth = 800): { src: string; srcSet?: string; sizes?: string } => {
  if (!src) return { src: "" };
  
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.toLowerCase().endsWith(".mp4") ||
    src.toLowerCase().endsWith(".mov") ||
    src.toLowerCase().endsWith(".webm")
  ) {
    return { src };
  }

  const url = src.startsWith("/") ? src : `/${src}`;

  return {
    src: url,
    srcSet: undefined,
    sizes: undefined,
  };
};

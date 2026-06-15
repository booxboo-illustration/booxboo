/**
 * Generates an optimized src URL for a specific width and quality.
 */
export const getOptimizedImageUrl = (src: string, width?: number, quality = 80): string => {
  if (!src) return "";
  
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
  
  return `/api/image?src=${encodeURIComponent(url)}${width ? `&w=${width}` : ""}&q=${quality}`;
};

/**
 * Returns src, srcSet, and sizes attributes for fully responsive and device-appropriate rendering.
 * Optimal width rules:
 * - Mobile: 400w
 * - Tablet/Medium content: 800w
 * - Large/Desktop viewports: 1200w and 1600w
 */
export const getResponsiveImageAttrs = (src: string, defaultWidth = 800) => {
  if (!src) return {};
  
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

  // SrcSet coordinates for responsive scaling
  const srcSet = [
    `${getOptimizedImageUrl(url, 400)} 400w`,
    `${getOptimizedImageUrl(url, 800)} 800w`,
    `${getOptimizedImageUrl(url, 1200)} 1200w`,
    `${getOptimizedImageUrl(url, 1600)} 1600w`,
  ].join(", ");

  return {
    src: getOptimizedImageUrl(url, defaultWidth),
    srcSet,
    // Grid or responsive element dimensions across layout stages:
    // - Under 640px (Mobile): full screen 100vw
    // - Under 1024px (Tablet 2 cols): half screen 50vw
    // - Desktop (3 cols): roughly 1/3 viewport 33vw
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 1200px",
  };
};

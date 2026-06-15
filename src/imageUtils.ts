/**
 * Generates an optimized src URL for a specific width and quality.
 */
export const getOptimizedImageUrl = (src: string, width?: number, quality = 92): string => {
  if (!src) return "";
  
  // Prevent double-optimization: if it already points to our optimization API or Netlify CDN,
  // extract the real raw path from its 'src' or 'url' query parameter.
  if (src.includes("/api/image") || src.includes("/.netlify/images")) {
    const match = src.match(/[?&](src|url)=([^&]+)/);
    if (match) {
      src = decodeURIComponent(match[2]);
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
  
  // If hosted on Netlify, use Netlify's native Image CDN
  const isNetlify = 
    typeof window !== "undefined" &&
    (window.location.hostname.includes("netlify.app") ||
      window.location.hostname.includes("booxboo.me"));

  if (isNetlify) {
    return `/.netlify/images?url=${encodeURIComponent(url)}${width ? `&w=${width}` : ""}&q=${quality}`;
  }
  
  // Local development fallback to Express server optimizer
  return `/api/image?src=${encodeURIComponent(url)}${width ? `&w=${width}` : ""}&q=${quality}`;
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

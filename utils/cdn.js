/**
 * CDN Configuration Utility
 * Centralizes CDN URLs and settings to make provider swapping easier
 */

// CDN Base URL - can be swapped for different providers
const CDN_BASE_URL =
  process.env.NEXT_PUBLIC_CDN_BASE_URL || "https://imagedelivery.net";
const CDN_ACCOUNT_HASH =
  process.env.NEXT_PUBLIC_CDN_ACCOUNT_HASH || "8PYt12v3QMuDRiYrOftNUQ";
const CDN_VARIANT = process.env.NEXT_PUBLIC_CDN_VARIANT || "public";

// Cloudflare-specific API configuration (server-side only)
const CLOUDFLARE_API_URL =
  process.env.CLOUDFLARE_API_URL || "https://api.cloudflare.com/client/v4";
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ID;
const CLOUDFLARE_TOKEN = process.env.CLOUDFLARE_TOKEN;

/**
 * Get the full CDN URL for a media item
 * @param {string} mediaId - The unique identifier for the media
 * @param {object} options - Optional image transformation parameters
 * @param {number} options.width - Width in pixels
 * @param {number} options.height - Height in pixels
 * @param {string} options.fit - Fit mode (scale-down, contain, cover, crop, pad)
 * @param {string} options.format - Format (auto, webp, avif, jpeg, png)
 * @param {number} options.quality - Quality (1-100)
 * @returns {string} Full URL to access the media
 */
const getCdnUrl = (mediaId, options = {}) => {
  if (!mediaId) return "";

  const baseUrl = `${CDN_BASE_URL}/${CDN_ACCOUNT_HASH}/${mediaId}/${CDN_VARIANT}`;

  // If no options, return base URL
  if (Object.keys(options).length === 0) return baseUrl;

  // Build query parameters for Cloudflare flexible variants
  const params = new URLSearchParams();
  if (options.width) params.append("width", options.width.toString());
  if (options.height) params.append("height", options.height.toString());
  if (options.fit) params.append("fit", options.fit);
  if (options.format) params.append("format", options.format);
  if (options.quality) params.append("quality", options.quality.toString());

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Get CDN configuration for Next.js image optimization
 * @returns {object} Configuration object with hostname and pathname pattern
 */
const getCdnImageConfig = () => {
  const url = new URL(CDN_BASE_URL);
  return {
    protocol: "https",
    hostname: url.hostname,
    port: "",
    pathname: `/${CDN_ACCOUNT_HASH}/**`,
  };
};

/**
 * Get the upload endpoint URL (server-side only)
 * @returns {string} API endpoint for direct uploads
 */
const getCdnUploadUrl = () => {
  if (!CLOUDFLARE_ACCOUNT_ID) {
    throw new Error("CLOUDFLARE_ID environment variable is not set");
  }
  return `${CLOUDFLARE_API_URL}/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`;
};

/**
 * Get CDN API authorization headers (server-side only)
 * @returns {object} Headers object for API authentication
 */
const getCdnAuthHeaders = () => {
  if (!CLOUDFLARE_TOKEN) {
    throw new Error("CLOUDFLARE_TOKEN environment variable is not set");
  }
  return {
    Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
  };
};

/**
 * Generate srcset attribute for responsive images
 * @param {string} mediaId - The unique identifier for the media
 * @param {number[]} widths - Array of widths to generate (default: [320, 640, 960, 1280, 1920])
 * @param {object} options - Additional image transformation options
 * @returns {string} srcset string for img tag
 */
const generateSrcSet = (
  mediaId,
  widths = [320, 640, 960, 1280, 1920],
  options = {},
) => {
  if (!mediaId) return "";

  return widths
    .map((width) => {
      const url = getCdnUrl(mediaId, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(", ");
};

/**
 * Generate sizes attribute for responsive images
 * @param {object} breakpoints - Breakpoints with their sizes
 * @returns {string} sizes string for img tag
 *
 * @example
 * generateSizes({
 *   '(max-width: 640px)': '100vw',
 *   '(max-width: 1024px)': '50vw',
 *   'default': '33vw'
 * })
 * // Returns: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 */
const generateSizes = (breakpoints = {}) => {
  const entries = Object.entries(breakpoints);
  const defaultIndex = entries.findIndex(([key]) => key === "default");

  // Separate default from media queries
  let mediaQueries = entries.filter(([key]) => key !== "default");
  const defaultSize = defaultIndex !== -1 ? entries[defaultIndex][1] : "100vw";

  // Build sizes string
  const sizesStr = mediaQueries
    .map(([query, size]) => `${query} ${size}`)
    .join(", ");

  return sizesStr ? `${sizesStr}, ${defaultSize}` : defaultSize;
};

/**
 * CDN Configuration object for easy access
 */
const CDN_CONFIG = {
  baseUrl: CDN_BASE_URL,
  accountHash: CDN_ACCOUNT_HASH,
  variant: CDN_VARIANT,
  getCdnUrl,
  getCdnImageConfig,
  getCdnUploadUrl,
  getCdnAuthHeaders,
  generateSrcSet,
  generateSizes,
};

// CommonJS exports for next.config.js compatibility
module.exports = {
  getCdnUrl,
  getCdnImageConfig,
  getCdnUploadUrl,
  getCdnAuthHeaders,
  generateSrcSet,
  generateSizes,
  CDN_CONFIG,
};

// ES6 exports for TypeScript/modern JavaScript
module.exports.default = CDN_CONFIG;

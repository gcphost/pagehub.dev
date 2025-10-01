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
 * @returns {string} Full URL to access the media
 */
const getCdnUrl = (mediaId) => {
  if (!mediaId) return "";
  return `${CDN_BASE_URL}/${CDN_ACCOUNT_HASH}/${mediaId}/${CDN_VARIANT}`;
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
};

// CommonJS exports for next.config.js compatibility
module.exports = {
  getCdnUrl,
  getCdnImageConfig,
  getCdnUploadUrl,
  getCdnAuthHeaders,
  CDN_CONFIG,
};

// ES6 exports for TypeScript/modern JavaScript
module.exports.default = CDN_CONFIG;


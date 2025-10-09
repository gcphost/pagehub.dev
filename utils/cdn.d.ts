/**
 * TypeScript definitions for CDN utilities
 */

export interface CdnImageOptions {
  width?: number;
  height?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  format?: "auto" | "webp" | "avif" | "jpeg" | "png";
  quality?: number;
}

export interface CdnSizesBreakpoints {
  [mediaQuery: string]: string;
}

/**
 * Get the full CDN URL for a media item
 */
export function getCdnUrl(mediaId: string, options?: CdnImageOptions): string;

/**
 * Get CDN configuration for Next.js image optimization
 */
export function getCdnImageConfig(): {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
};

/**
 * Get the upload endpoint URL (server-side only)
 */
export function getCdnUploadUrl(): string;

/**
 * Get CDN API authorization headers (server-side only)
 */
export function getCdnAuthHeaders(): {
  Authorization: string;
};

/**
 * Generate srcset attribute for responsive images
 */
export function generateSrcSet(
  mediaId: string,
  widths?: number[],
  options?: CdnImageOptions
): string;

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints?: CdnSizesBreakpoints): string;

/**
 * CDN Configuration object
 */
export const CDN_CONFIG: {
  baseUrl: string;
  accountHash: string;
  variant: string;
  getCdnUrl: typeof getCdnUrl;
  getCdnImageConfig: typeof getCdnImageConfig;
  getCdnUploadUrl: typeof getCdnUploadUrl;
  getCdnAuthHeaders: typeof getCdnAuthHeaders;
  generateSrcSet: typeof generateSrcSet;
  generateSizes: typeof generateSizes;
};

export default CDN_CONFIG;

/**
 * SEO Utilities for PageHub
 * Provides helpers for generating structured data and SEO metadata
 */

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robots?: string;
  themeColor?: string;
}

/**
 * Generate JSON-LD structured data for a webpage
 */
export function generateWebPageSchema(data: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.name,
    description: data.description,
    url: data.url,
    ...(data.image && { image: data.image }),
    ...(data.author && {
      author: {
        "@type": "Person",
        name: data.author,
      },
    }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
  };
}

/**
 * Generate JSON-LD for an organization
 */
export function generateOrganizationSchema(data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[]; // Social media profiles
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };
}

/**
 * Generate JSON-LD for breadcrumbs
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Validate and sanitize SEO title
 */
export function sanitizeTitle(title: string, maxLength = 60): string {
  if (!title) return "";
  return title.length > maxLength
    ? `${title.substring(0, maxLength - 3)}...`
    : title;
}

/**
 * Validate and sanitize SEO description
 */
export function sanitizeDescription(
  description: string,
  maxLength = 160
): string {
  if (!description) return "";
  return description.length > maxLength
    ? `${description.substring(0, maxLength - 3)}...`
    : description;
}

/**
 * Generate a full URL from parts
 */
export function generateFullUrl(
  protocol: string,
  host: string,
  pathname: string,
  includeTrailingSlash = false
): string {
  let url = `${protocol}//${host}${pathname}`;
  if (includeTrailingSlash && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return "";
  }
}

/**
 * Check if a URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Make URL absolute if it's relative
 */
export function makeAbsoluteUrl(url: string, baseUrl: string): string {
  if (isAbsoluteUrl(url)) return url;
  try {
    return new URL(url, baseUrl).toString();
  } catch (e) {
    return url;
  }
}

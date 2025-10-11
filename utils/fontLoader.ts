/**
 * Font loading utilities to prevent FOUC (Flash of Unstyled Content)
 * and improve perceived performance
 */

export interface FontLoadOptions {
  timeout?: number; // Max time to wait for fonts in ms (default: 3000)
  onTimeout?: () => void;
  onLoaded?: () => void;
}

/**
 * Wait for all fonts to be loaded using the CSS Font Loading API
 * Falls back to timeout if fonts take too long
 */
export const waitForFonts = async (
  options: FontLoadOptions = {},
): Promise<boolean> => {
  const { timeout = 3000, onTimeout, onLoaded } = options;

  if (typeof window === "undefined" || !document.fonts) {
    return true; // Skip on SSR or unsupported browsers
  }

  try {
    // Race between fonts loading and timeout
    const fontsLoaded = await Promise.race([
      document.fonts.ready,
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.warn("Font loading timeout reached");
          onTimeout?.();
          resolve(false);
        }, timeout);
      }),
    ]);

    if (fontsLoaded) {
      onLoaded?.();
    }

    return fontsLoaded as boolean;
  } catch (error) {
    console.error("Error waiting for fonts:", error);
    return false;
  }
};

/**
 * Load a specific Google Font family with weights
 */
export const loadGoogleFont = (
  family: string,
  weights: (number | string)[] = [400],
  display: "swap" | "block" | "fallback" | "optional" = "swap",
): void => {
  if (typeof window === "undefined") return;

  const normalizedFamily = family.replace(/ +/g, "+");
  const weightStr = weights.join(";");

  const href = `https://fonts.googleapis.com/css2?family=${normalizedFamily}:wght@${weightStr}&display=${display}`;

  // Check if already loaded
  const existingLinks = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]'),
  );
  if (existingLinks.some((link) => (link as HTMLLinkElement).href === href)) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;

  document.head.appendChild(link);
};

/**
 * Preload critical fonts for faster LCP
 */
export const preloadFont = (
  fontUrl: string,
  fontType: string = "woff2",
): void => {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.type = `font/${fontType}`;
  link.href = fontUrl;
  link.crossOrigin = "anonymous";

  document.head.appendChild(link);
};

/**
 * Get loading state for fonts - useful for showing loading indicators
 */
export const getFontLoadingState = (): "loading" | "loaded" | "error" => {
  if (typeof window === "undefined" || !document.fonts) {
    return "loaded";
  }

  if (document.fonts.status === "loaded") {
    return "loaded";
  }

  return "loading";
};

/**
 * Hook-style font loader for React components
 * Usage: Call this in useEffect to wait for fonts before showing content
 */
export const useFontLoader = (onReady?: () => void, timeout = 3000) => {
  if (typeof window === "undefined") return;

  waitForFonts({
    timeout,
    onLoaded: onReady,
    onTimeout: () => {
      console.warn("Fonts took too long to load, showing content anyway");
      onReady?.();
    },
  });
};

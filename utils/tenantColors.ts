// Utility functions for managing tenant-based color overrides

export interface TenantBranding {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

/**
 * Generates CSS custom properties for tenant branding colors
 */
export function generateTenantCSSVariables(branding: TenantBranding): string {
  const variables: string[] = [];

  if (branding.primaryColor) {
    // Generate primary color palette
    const primary = branding.primaryColor;
    variables.push(`--primary-color: ${primary};`);
    variables.push(`--primary-500: ${primary};`);

    // Generate lighter/darker variants (simplified approach)
    variables.push(`--primary-50: ${adjustColorBrightness(primary, 0.9)};`);
    variables.push(`--primary-100: ${adjustColorBrightness(primary, 0.8)};`);
    variables.push(`--primary-200: ${adjustColorBrightness(primary, 0.6)};`);
    variables.push(`--primary-300: ${adjustColorBrightness(primary, 0.4)};`);
    variables.push(`--primary-400: ${adjustColorBrightness(primary, 0.2)};`);
    variables.push(`--primary-600: ${adjustColorBrightness(primary, -0.2)};`);
    variables.push(`--primary-700: ${adjustColorBrightness(primary, -0.4)};`);
    variables.push(`--primary-800: ${adjustColorBrightness(primary, -0.6)};`);
    variables.push(`--primary-900: ${adjustColorBrightness(primary, -0.8)};`);
    variables.push(`--primary-950: ${adjustColorBrightness(primary, -0.9)};`);
  }

  if (branding.secondaryColor) {
    // Generate secondary color palette
    const secondary = branding.secondaryColor;
    variables.push(`--secondary-color: ${secondary};`);
    variables.push(`--secondary-500: ${secondary};`);

    // Generate lighter/darker variants
    variables.push(`--secondary-50: ${adjustColorBrightness(secondary, 0.9)};`);
    variables.push(
      `--secondary-100: ${adjustColorBrightness(secondary, 0.8)};`
    );
    variables.push(
      `--secondary-200: ${adjustColorBrightness(secondary, 0.6)};`
    );
    variables.push(
      `--secondary-300: ${adjustColorBrightness(secondary, 0.4)};`
    );
    variables.push(
      `--secondary-400: ${adjustColorBrightness(secondary, 0.2)};`
    );
    variables.push(
      `--secondary-600: ${adjustColorBrightness(secondary, -0.2)};`
    );
    variables.push(
      `--secondary-700: ${adjustColorBrightness(secondary, -0.4)};`
    );
    variables.push(
      `--secondary-800: ${adjustColorBrightness(secondary, -0.6)};`
    );
    variables.push(
      `--secondary-900: ${adjustColorBrightness(secondary, -0.8)};`
    );
    variables.push(
      `--secondary-950: ${adjustColorBrightness(secondary, -0.9)};`
    );
  }

  if (branding.accentColor) {
    // Generate accent color palette
    const accent = branding.accentColor;
    variables.push(`--accent-color: ${accent};`);
    variables.push(`--accent-500: ${accent};`);

    // Generate lighter/darker variants
    variables.push(`--accent-50: ${adjustColorBrightness(accent, 0.9)};`);
    variables.push(`--accent-100: ${adjustColorBrightness(accent, 0.8)};`);
    variables.push(`--accent-200: ${adjustColorBrightness(accent, 0.6)};`);
    variables.push(`--accent-300: ${adjustColorBrightness(accent, 0.4)};`);
    variables.push(`--accent-400: ${adjustColorBrightness(accent, 0.2)};`);
    variables.push(`--accent-600: ${adjustColorBrightness(accent, -0.2)};`);
    variables.push(`--accent-700: ${adjustColorBrightness(accent, -0.4)};`);
    variables.push(`--accent-800: ${adjustColorBrightness(accent, -0.6)};`);
    variables.push(`--accent-900: ${adjustColorBrightness(accent, -0.8)};`);
    variables.push(`--accent-950: ${adjustColorBrightness(accent, -0.9)};`);
  }

  return variables.join("\n");
}

/**
 * Adjusts the brightness of a hex color
 * @param hex - Hex color string (e.g., "#ff0000" or "ff0000")
 * @param factor - Brightness factor (-1 to 1, where 0 is no change)
 */
function adjustColorBrightness(hex: string, factor: number): string {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Adjust brightness
  const newR = Math.max(0, Math.min(255, Math.round(r + (255 - r) * factor)));
  const newG = Math.max(0, Math.min(255, Math.round(g + (255 - g) * factor)));
  const newB = Math.max(0, Math.min(255, Math.round(b + (255 - b) * factor)));

  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * Injects tenant CSS variables into the document
 */
export function injectTenantColors(branding: TenantBranding): void {
  if (typeof window === "undefined") return;

  const cssVariables = generateTenantCSSVariables(branding);

  // Remove existing tenant color styles
  const existingStyle = document.getElementById("tenant-colors");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const style = document.createElement("style");
  style.id = "tenant-colors";
  style.textContent = `:root {\n${cssVariables}\n}`;

  // Inject into document head
  document.head.appendChild(style);
}

/**
 * Removes tenant color overrides
 */
export function removeTenantColors(): void {
  if (typeof window === "undefined") return;

  const existingStyle = document.getElementById("tenant-colors");
  if (existingStyle) {
    existingStyle.remove();
  }
}

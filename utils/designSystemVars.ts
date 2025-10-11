// Utility functions for managing design system CSS variables

import { NamedColor } from "components/selectors/Background";

export interface DesignSystemVars {
  palette: NamedColor[];
  styleGuide: Record<string, any>;
}

/**
 * Convert a name to a valid CSS variable name
 * "Primary Text" -> "primary-text"
 * "inputBorder" -> "input-border"
 */
export function toCSSVarName(name: string): string {
  // Guard against undefined/null
  if (!name || typeof name !== "string") {
    console.warn("toCSSVarName received invalid name:", name);
    return "";
  }

  return name
    .replace(/([A-Z])/g, "-$1") // Add hyphen before capitals
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase()
    .replace(/^-/, ""); // Remove leading hyphen
}

/**
 * Convert palette name to CSS variable name with --ph- prefix
 * "Primary" -> "--ph-primary"
 */
export function toPaletteCSSVarName(name: string): string {
  return `--ph-${toCSSVarName(name)}`;
}

/**
 * Convert style name to CSS variable name with --ph- prefix
 * "inputBorder" -> "--ph-input-border"
 */
export function toStyleCSSVarName(name: string): string {
  return `--ph-${toCSSVarName(name)}`;
}

/**
 * Convert Tailwind color to actual CSS color value
 * "blue-500" -> actual hex color from Tailwind
 * "#ff0000" -> "#ff0000"
 * "white" -> "#ffffff"
 */
function resolveTailwindColor(color: string): string {
  // If it's already a hex, rgba, or rgb value, return as-is
  if (
    color.startsWith("#") ||
    color.startsWith("rgba") ||
    color.startsWith("rgb")
  ) {
    return color;
  }

  // Handle special named colors
  const specialColors: Record<string, string> = {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
    current: "currentColor",
  };

  if (specialColors[color]) {
    return specialColors[color];
  }

  // For Tailwind color classes like "blue-500" or "gray-900",
  // we need to import the actual color values
  try {
    const colors = require("tailwindcss/colors");

    // Parse "blue-500" -> colors.blue[500]
    const parts = color.split("-");
    if (parts.length === 2) {
      const [colorName, shade] = parts;
      if (
        colors[colorName] &&
        typeof colors[colorName] === "object" &&
        colors[colorName][shade]
      ) {
        return colors[colorName][shade];
      }
    }
  } catch (e) {
    // If we can't resolve it, return as-is
  }

  // Fallback: return the value as-is
  return color;
}

/**
 * Generates CSS custom properties for palette colors
 * palette:Primary -> --ph-primary
 */
export function generatePaletteCSSVariables(palette: NamedColor[]): string {
  const variables: string[] = [];

  if (!palette || !Array.isArray(palette)) {
    console.warn(
      "generatePaletteCSSVariables received invalid palette:",
      palette,
    );
    return "";
  }

  palette.forEach((item) => {
    if (!item || !item.name || !item.color) {
      console.warn("Skipping invalid palette item:", item);
      return;
    }

    const varName = toCSSVarName(item.name);
    if (!varName) return; // Skip if name couldn't be converted

    const colorValue = resolveTailwindColor(item.color);
    variables.push(`  --ph-${varName}: ${colorValue};`);
  });

  return variables.join("\n");
}

/**
 * Generates CSS custom properties for style guide values
 * Creates CSS variables for actual CSS values (colors, sizes, measurements)
 * NOT for Tailwind utility classes like "rounded-lg" or "px-6 py-3"
 */
export function generateStyleGuideCSSVariables(
  styleGuide: Record<string, any>,
): string {
  const variables: string[] = [];

  if (!styleGuide || typeof styleGuide !== "object") {
    console.warn(
      "generateStyleGuideCSSVariables received invalid styleGuide:",
      styleGuide,
    );
    return "";
  }

  // Create CSS variables for actual CSS values
  // These are values that can be used with Tailwind arbitrary syntax
  const cssVarKeys = [
    // Colors
    "inputBorderColor",
    "inputBgColor",
    "inputTextColor",
    "inputPlaceholderColor",
    "inputFocusRingColor",
    "linkColor",
    "linkHoverColor",
    // Sizes & measurements (actual CSS values, not Tailwind classes)
    "inputBorderWidth",
    "inputBorderRadius",
    "inputPadding",
    "inputFocusRing",
    // Layout & spacing
    "borderRadius",
    "buttonPadding",
    "containerPadding",
    "sectionGap",
    "containerGap",
    "contentWidth",
    "shadowStyle",
    // Typography
    "headingFont",
    "bodyFont",
  ];

  Object.entries(styleGuide).forEach(([key, value]) => {
    if (value && typeof value === "string" && cssVarKeys.includes(key)) {
      const varName = toCSSVarName(key);
      if (!varName) return; // Skip if key couldn't be converted

      // If the value references a palette, we need to resolve it
      let resolvedValue = value;
      if (value.startsWith("palette:")) {
        const paletteName = value.replace("palette:", "").trim();
        if (!paletteName) return; // Skip if palette name is empty

        const cssVarName = toCSSVarName(paletteName);
        if (!cssVarName) return; // Skip if palette name couldn't be converted

        resolvedValue = `var(--ph-${cssVarName})`;
      } else {
        // For non-palette values, resolve Tailwind colors to actual hex values
        resolvedValue = resolveTailwindColor(value);
      }

      variables.push(`  --ph-${varName}: ${resolvedValue};`);
    }
  });

  return variables.join("\n");
}

/**
 * Generates all design system CSS variables
 */
export function generateDesignSystemCSSVariables(
  designSystem: DesignSystemVars,
): string {
  const paletteVars = generatePaletteCSSVariables(designSystem.palette);
  const styleVars = generateStyleGuideCSSVariables(designSystem.styleGuide);

  return `:root {\n${paletteVars}\n${styleVars}\n}`;
}

/**
 * Injects design system CSS variables into the document
 */
export function injectDesignSystemVars(designSystem: DesignSystemVars): void {
  if (typeof window === "undefined") return;

  const cssText = generateDesignSystemCSSVariables(designSystem);

  // Remove existing design system styles
  const existingStyle = document.getElementById("design-system-vars");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const style = document.createElement("style");
  style.id = "design-system-vars";
  style.textContent = cssText;

  // Inject into document head
  document.head.appendChild(style);
}

/**
 * Removes design system CSS variables
 */
export function removeDesignSystemVars(): void {
  if (typeof window === "undefined") return;

  const existingStyle = document.getElementById("design-system-vars");
  if (existingStyle) {
    existingStyle.remove();
  }
}

/**
 * Convert palette reference to CSS variable
 * "palette:Primary" -> "var(--ph-primary)"
 */
export function paletteToCSSVar(value: string): string {
  if (!value || typeof value !== "string") {
    return value || "";
  }

  if (value.startsWith("palette:")) {
    const name = value.replace("palette:", "").trim();
    if (!name) return value;

    const varName = toCSSVarName(name);
    if (!varName) return value;

    return `var(--ph-${varName})`;
  }
  return value;
}

/**
 * Convert style reference to CSS variable
 * "style:inputBorder" -> "var(--ph-input-border)"
 */
export function styleToCSSVar(value: string): string {
  if (!value || typeof value !== "string") {
    return value || "";
  }

  if (value.startsWith("style:")) {
    const name = value.replace("style:", "").trim();
    if (!name) return value;

    const varName = toCSSVarName(name);
    if (!varName) return value;

    return `var(--ph-${varName})`;
  }
  return value;
}

/**
 * Convert palette/style reference to Tailwind arbitrary value
 * "palette:Primary" -> "[--ph-primary]"
 * "style:inputBorder" -> "[--ph-input-border]"
 */
export function toTailwindArbitraryValue(
  value: string,
  prefix: string = "",
): string {
  if (!value || typeof value !== "string") {
    return value || "";
  }

  let varRef = "";

  if (value.startsWith("palette:")) {
    const name = value.replace("palette:", "").trim();
    if (!name) return value;

    const varName = toCSSVarName(name);
    if (!varName) return value;

    varRef = `--ph-${varName}`;
  } else if (value.startsWith("style:")) {
    const name = value.replace("style:", "").trim();
    if (!name) return value;

    const varName = toCSSVarName(name);
    if (!varName) return value;

    varRef = `--ph-${varName}`;
  } else {
    return value;
  }

  // Return in Tailwind arbitrary value format
  return prefix ? `${prefix}-[var(${varRef})]` : `[var(${varRef})]`;
}

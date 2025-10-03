import { NamedColor } from "components/selectors/Background";

/**
 * Check if a color value is a palette reference
 * Format: palette:ColorName or palette-ColorName
 */
export const isPaletteReference = (value: string): boolean => {
  if (!value || typeof value !== "string") return false;
  return value.startsWith("palette:") || value.startsWith("palette-");
};

/**
 * Extract the palette color name from a reference
 * Example: "palette:Brand" -> "Brand"
 */
export const getPaletteName = (value: string): string => {
  if (value.startsWith("palette:")) {
    return value.substring(8);
  }
  if (value.startsWith("palette-")) {
    return value.substring(8);
  }
  return value;
};

/**
 * Create a palette reference from a color name
 * Example: "Brand" -> "palette:Brand"
 */
export const createPaletteReference = (name: string): string => {
  return `palette:${name}`;
};

/**
 * Resolve a palette reference to its actual color value
 * If not a palette reference, return the value as-is
 */
export const resolvePaletteColor = (
  value: string,
  palette: NamedColor[]
): string => {
  if (!isPaletteReference(value)) {
    return value;
  }

  const name = getPaletteName(value);
  const paletteColor = palette?.find((p) => p.name === name);

  if (paletteColor) {
    return paletteColor.color;
  }

  // Fallback if palette color not found
  console.warn(`Palette color "${name}" not found`);
  return value;
};

// Default palette colors - single source of truth
export const DEFAULT_PALETTE = [
  { name: "Primary", color: "blue-500" },
  { name: "Primary Text", color: "white" },
  { name: "Secondary", color: "purple-500" },
  { name: "Secondary Text", color: "white" },
  { name: "Accent", color: "orange-500" },
  { name: "Accent Text", color: "white" },
  { name: "Neutral", color: "gray-500" },
  { name: "Neutral Text", color: "white" },
  { name: "Background", color: "white" },
  { name: "Text", color: "gray-900" },
  { name: "Alternate Background", color: "gray-50" },
  { name: "Alternate Text", color: "gray-600" },
];

// Default style guide values - single source of truth
export const DEFAULT_STYLE_GUIDE = {
  // Spacing & Layout - using CSS values for CSS vars
  borderRadius: "0.5rem", // rounded-lg = 0.5rem
  buttonPadding: "1.5rem 0.75rem", // Large button padding (x y format)
  containerPadding: "2rem 2rem", // Large container padding (x y format)
  sectionGap: "4rem", // Large section gap
  containerGap: "1.5rem", // Medium container gap
  contentWidth: "80rem", // 2XL content width

  // Typography - using CSS values for CSS vars
  headingFont: "700", // font-bold = 700
  headingFontFamily: "Open Sans",
  bodyFont: "400", // font-normal = 400
  bodyFontFamily: "Open Sans",
  shadowStyle:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", // shadow-lg

  // Form inputs - mixed approach
  inputBorderWidth: "1px", // CSS value for CSS var
  inputBorderColor: "palette:Neutral",
  inputBorderRadius: "0.375rem", // CSS value for CSS var (rounded-md = 0.375rem)
  inputPadding: "1rem 1rem", // CSS value for CSS var (px-4 py-2)
  inputBgColor: "white",
  inputTextColor: "gray-900",
  inputPlaceholderColor: "gray-400",
  inputFocusRing: "2px", // CSS value for CSS var
  inputFocusRingColor: "palette:Primary",

  // Links - colors only
  linkColor: "palette:Primary",
  linkHoverColor: "palette:Secondary",
  linkUnderline: "no-underline", // Tailwind class
  linkUnderlineOffset: "underline-offset-2", // Tailwind class
};

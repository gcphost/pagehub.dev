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
  borderRadius: "rounded-lg",
  buttonPadding: "px-6 py-3",
  containerSpacing: "p-8",
  sectionGap: "gap-16",
  containerGap: "gap-6",
  contentWidth: "max-w-7xl",
  headingFont: "font-bold",
  headingFontFamily: "Open Sans, sans-serif",
  bodyFont: "font-normal",
  bodyFontFamily: "Open Sans, sans-serif",
  shadowStyle: "shadow-lg",
  // Form inputs
  inputBorderWidth: "border",
  inputBorderColor: "palette:Neutral",
  inputBorderRadius: "rounded-md",
  inputPadding: "px-4 py-2",
  inputBgColor: "white",
  inputTextColor: "gray-900",
  inputPlaceholderColor: "gray-400",
  inputFocusRing: "ring-2",
  inputFocusRingColor: "palette:Primary",
  // Links
  linkColor: "palette:Primary",
  linkHoverColor: "palette:Secondary",
  linkUnderline: "no-underline",
  linkUnderlineOffset: "underline-offset-2",
};

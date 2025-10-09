/**
 * Centralized Presets Configuration for All Selectors
 *
 * This file defines all preset styles, sizes, and options for selector components.
 * Edit this file to add, modify, or remove presets across the entire application.
 */

// Type definitions for presets
export type PresetItem = {
  title: string;
  var: string;
  root?: Record<string, string>;
  mobile?: Record<string, string>;
  tablet?: Record<string, string>;
  desktop?: Record<string, string>;
};

export type PresetGroup = {
  label: string;
  type?: "slider" | "select" | "radio";
  propKey?: string;
  propType?: string;
  help?: string;
  items: PresetItem[];
};

// ============================================================================
// CONTAINER PRESETS
// ============================================================================

export const containerPresets = {
  padding: {
    label: "Padding",
    type: "slider" as const,
    propKey: "presetPadding",
    propType: "root",
    help: "Adjust the inner spacing of the container",
    items: [
      {
        title: "No padding",
        var: "pad-none",
        mobile: {
          px: "",
          py: "",
        },
        desktop: {
          px: "",
          py: "",
        },
      },
      {
        title: "Small Padding",
        var: "pad-sm",
        mobile: {
          px: "px-3",
          py: "py-3",
        },
        desktop: {
          px: "px-5",
          py: "py-5",
        },
      },
      {
        title: "Medium Padding",
        var: "pad-md",
        mobile: {
          px: "px-6",
          py: "py-6",
        },
        desktop: {
          px: "px-12",
          py: "py-12",
        },
      },
      {
        title: "Large Padding (Design System)",
        var: "pad-lg",
        mobile: {
          px: "px-[var(--ph-container-padding-x)]",
          py: "py-[var(--ph-container-padding-y)]",
        },
      },
      {
        title: "Section Gap",
        var: "pad-section",
        mobile: {
          px: "px-[var(--ph-section-gap)]",
          py: "py-[var(--ph-section-gap)]",
        },
      },
      {
        title: "Extra Large Padding",
        var: "pad-xl",
        mobile: {
          px: "px-24",
          py: "py-24",
        },
        desktop: {
          px: "px-48",
          py: "py-48",
        },
      },
    ],
  },

  width: {
    label: "Width",
    type: "slider" as const,
    propKey: "preset",
    propType: "root",
    items: [
      {
        title: "Quarter",
        var: "size-1/4",
        mobile: {
          width: "w-full",
        },
        desktop: {
          width: "w-1/4",
        },
      },
      {
        title: "Third",
        var: "size-1/3",
        mobile: {
          width: "w-full",
        },
        desktop: {
          width: "w-1/3",
        },
      },
      {
        title: "Half",
        var: "size-1/2",
        mobile: {
          width: "w-full",
        },
        desktop: {
          width: "w-1/2",
        },
      },
      {
        title: "Two Thirds",
        var: "size-2/3",
        mobile: {
          width: "w-full",
        },
        desktop: {
          width: "w-2/3",
        },
      },
      {
        title: "Three Quarters",
        var: "size-3/4",
        mobile: {
          width: "w-full",
        },
        desktop: {
          width: "w-3/4",
        },
      },
      {
        title: "Full",
        var: "size-full",
        mobile: {
          width: "w-full",
        },
        desktop: {
          width: "w-full",
        },
      },
    ],
  },

  maxWidth: {
    label: "Max Width",
    type: "slider" as const,
    propKey: "presetMaxWidth",
    propType: "root",
    items: [
      {
        title: "Small",
        var: "max-w-sm",
        mobile: {
          maxWidth: "max-w-sm",
        },
      },
      {
        title: "Medium",
        var: "max-w-md",
        mobile: {
          maxWidth: "max-w-md",
        },
      },
      {
        title: "Large",
        var: "max-w-lg",
        mobile: {
          maxWidth: "max-w-lg",
        },
      },
      {
        title: "Extra Large",
        var: "max-w-xl",
        mobile: {
          maxWidth: "max-w-xl",
        },
      },
      {
        title: "2XL",
        var: "max-w-2xl",
        mobile: {
          maxWidth: "max-w-2xl",
        },
      },
      {
        title: "3XL",
        var: "max-w-3xl",
        mobile: {
          maxWidth: "max-w-3xl",
        },
      },
      {
        title: "4XL",
        var: "max-w-4xl",
        mobile: {
          maxWidth: "max-w-4xl",
        },
      },
      {
        title: "5XL",
        var: "max-w-5xl",
        mobile: {
          maxWidth: "max-w-5xl",
        },
      },
      {
        title: "6XL",
        var: "max-w-6xl",
        mobile: {
          maxWidth: "max-w-6xl",
        },
      },
      {
        title: "7XL",
        var: "max-w-7xl",
        mobile: {
          maxWidth: "max-w-7xl",
        },
      },
      {
        title: "Content Width (Design System)",
        var: "max-w-content",
        mobile: {
          maxWidth: "max-w-[var(--ph-content-width)]",
        },
      },
      {
        title: "Full Width",
        var: "max-w-full",
        mobile: {
          maxWidth: "max-w-full",
        },
      },
      {
        title: "Screen Width",
        var: "max-w-screen",
        mobile: {
          maxWidth: "max-w-screen-2xl",
        },
      },
    ],
  },

  flexDirection: {
    label: "Flex Direction",
    type: "slider" as const,
    propKey: "presetType",
    propType: "root",
    items: [
      {
        title: "Columns",
        var: "flexDirection",
        mobile: {
          flexDirection: "flex-col",
        },
      },
      {
        title: "Rows",
        var: "flexDirection",
        mobile: {
          flexDirection: "flex-col",
        },
        desktop: {
          flexDirection: "flex-row",
        },
      },
      {
        title: "Reverse Columns",
        var: "flexDirection",
        mobile: {
          flexDirection: "flex-col-reverse",
        },
      },
      {
        title: "Reverse Rows",
        var: "flexDirection",
        mobile: {
          flexDirection: "flex-col-reverse",
        },
        desktop: {
          flexDirection: "flex-row-reverse",
        },
      },
    ],
  },

  backgroundPatterns: {
    label: "Background Patterns",
    type: "select" as const,
    propKey: "preset",
    propType: "root",
    items: [
      {
        title: "Hero 1",
        var: "hero-1",
        root: {
          pattern: "wiggle",
          patternColorA: "rgb(207,207,207)",
          patternColorB: "rgb(207,207,207)",
          backgroundFrom: "from-[rgb(255,255,255)]",
          backgroundTo: "to-[rgba(29,29,29,0.63)]",
        },
      },
      {
        title: "Hero 2",
        var: "hero-2",
        root: {
          pattern: "wiggle",
          patternColorA: "rgb(207,207,207)",
          patternColorB: "rgb(207,207,207)",
          backgroundFrom: "from-[rgb(255,255,255)]",
          backgroundTo: "to-[rgba(29,29,29,0.63)]",
        },
      },
    ],
  },
};

// ============================================================================
// BACKGROUND IMAGE PRESETS
// ============================================================================

export const backgroundImagePresets = {
  layouts: {
    label: "Background Layouts",
    type: "select" as const,
    propKey: "presetLayout",
    propType: "component",
    help: "Choose from common background image layouts",
    items: [
      {
        title: "Hero Section",
        var: "hero-section",
        mobile: {
          height: "h-96",
          minHeight: "min-h-[400px]",
          display: "flex",
          flexDirection: "flex-col",
          justifyContent: "justify-center",
          alignItems: "items-center",
          backgroundSize: "bg-cover",
          backgroundPosition: "bg-center",
          backgroundAttachment: "bg-fixed",
          px: "px-4",
          py: "py-16",
        },
        desktop: {
          height: "h-[600px]",
          minHeight: "min-h-[600px]",
          px: "px-8",
          py: "py-24",
        },
      },
      {
        title: "Full Screen",
        var: "full-screen",
        mobile: {
          height: "h-screen",
          minHeight: "min-h-screen",
          display: "flex",
          flexDirection: "flex-col",
          justifyContent: "justify-center",
          alignItems: "items-center",
          backgroundSize: "bg-cover",
          backgroundPosition: "bg-center",
          backgroundAttachment: "bg-fixed",
          px: "px-4",
          py: "py-8",
        },
        desktop: {
          px: "px-8",
          py: "py-16",
        },
      },
      {
        title: "Card Style",
        var: "card-style",
        mobile: {
          height: "h-64",
          minHeight: "min-h-[300px]",
          display: "flex",
          flexDirection: "flex-col",
          justifyContent: "justify-end",
          alignItems: "items-start",
          backgroundSize: "bg-cover",
          backgroundPosition: "bg-center",
          px: "px-6",
          py: "py-8",
          borderRadius: "rounded-xl",
        },
        desktop: {
          height: "h-80",
          minHeight: "min-h-[350px]",
          px: "px-8",
          py: "py-10",
        },
      },
      {
        title: "Wide Banner",
        var: "wide-banner",
        mobile: {
          height: "h-48",
          minHeight: "min-h-[200px]",
          display: "flex",
          flexDirection: "flex-row",
          justifyContent: "justify-center",
          alignItems: "items-center",
          backgroundSize: "bg-cover",
          backgroundPosition: "bg-center",
          px: "px-4",
          py: "py-8",
        },
        desktop: {
          height: "h-64",
          minHeight: "min-h-[250px]",
          px: "px-8",
          py: "py-12",
        },
      },
      {
        title: "Overlay Content",
        var: "overlay-content",
        mobile: {
          height: "h-80",
          minHeight: "min-h-[400px]",
          display: "flex",
          flexDirection: "flex-col",
          justifyContent: "justify-center",
          alignItems: "items-center",
          backgroundSize: "bg-cover",
          backgroundPosition: "bg-center",
          backgroundAttachment: "bg-fixed",
          px: "px-4",
          py: "py-16",
          position: "relative",
        },
        desktop: {
          height: "h-[500px]",
          minHeight: "min-h-[500px]",
          px: "px-8",
          py: "py-20",
        },
      },
      {
        title: "Parallax",
        var: "parallax",
        mobile: {
          height: "h-96",
          minHeight: "min-h-[400px]",
          display: "flex",
          flexDirection: "flex-col",
          justifyContent: "justify-center",
          alignItems: "items-center",
          backgroundSize: "bg-cover",
          backgroundPosition: "bg-center",
          backgroundAttachment: "bg-fixed",
          backgroundRepeat: "bg-no-repeat",
          px: "px-4",
          py: "py-16",
        },
        desktop: {
          height: "h-[600px]",
          minHeight: "min-h-[600px]",
          px: "px-8",
          py: "py-24",
        },
      },
      {
        title: "Fixed Background",
        var: "fixed-background",
        mobile: {
          height: "h-screen",
          minHeight: "min-h-screen",
          display: "flex",
          flexDirection: "flex-col",
          justifyContent: "justify-center",
          alignItems: "items-center",
          backgroundSize: "bg-cover",
          backgroundPosition: "bg-center",
          backgroundAttachment: "bg-fixed",
          backgroundRepeat: "bg-no-repeat",
          px: "px-4",
          py: "py-8",
        },
        desktop: {
          px: "px-8",
          py: "py-16",
        },
      },
    ],
  },

  overlays: {
    label: "Background Overlays",
    type: "select" as const,
    propKey: "presetOverlay",
    propType: "root",
    help: "Add overlays to improve text readability over background images",
    items: [
      {
        title: "Dark Overlay",
        var: "dark-overlay",
        root: {
          backgroundGradient: "bg-gradient-to-b",
          backgroundGradientFrom: "from-black/50",
          backgroundGradientTo: "to-black/30",
        },
      },
      {
        title: "Light Overlay",
        var: "light-overlay",
        root: {
          backgroundGradient: "bg-gradient-to-b",
          backgroundGradientFrom: "from-white/50",
          backgroundGradientTo: "to-white/30",
        },
      },
      {
        title: "Primary Overlay",
        var: "primary-overlay",
        root: {
          backgroundGradient: "bg-gradient-to-b",
          backgroundGradientFrom: "from-[var(--ph-primary)]/60",
          backgroundGradientTo: "to-[var(--ph-primary)]/40",
        },
      },
      {
        title: "Subtle Dark",
        var: "subtle-dark",
        root: {
          backgroundGradient: "bg-gradient-to-b",
          backgroundGradientFrom: "from-black/30",
          backgroundGradientTo: "to-black/10",
        },
      },
      {
        title: "Subtle Light",
        var: "subtle-light",
        root: {
          backgroundGradient: "bg-gradient-to-b",
          backgroundGradientFrom: "from-white/30",
          backgroundGradientTo: "to-white/10",
        },
      },
      {
        title: "No Overlay",
        var: "no-overlay",
        root: {
          backgroundGradient: "",
          backgroundGradientFrom: "",
          backgroundGradientTo: "",
        },
      },
    ],
  },

  content: {
    label: "Content Positioning",
    type: "select" as const,
    propKey: "presetContent",
    propType: "mobile",
    help: "Position content over the background image",
    items: [
      {
        title: "Center Content",
        var: "center-content",
        mobile: {
          justifyContent: "justify-center",
          alignItems: "items-center",
          textAlign: "text-center",
        },
      },
      {
        title: "Top Left",
        var: "top-left",
        mobile: {
          justifyContent: "justify-start",
          alignItems: "items-start",
          textAlign: "text-left",
        },
      },
      {
        title: "Top Right",
        var: "top-right",
        mobile: {
          justifyContent: "justify-end",
          alignItems: "items-start",
          textAlign: "text-right",
        },
      },
      {
        title: "Bottom Left",
        var: "bottom-left",
        mobile: {
          justifyContent: "justify-start",
          alignItems: "items-end",
          textAlign: "text-left",
        },
      },
      {
        title: "Bottom Right",
        var: "bottom-right",
        mobile: {
          justifyContent: "justify-end",
          alignItems: "items-end",
          textAlign: "text-right",
        },
      },
      {
        title: "Bottom Center",
        var: "bottom-center",
        mobile: {
          justifyContent: "justify-center",
          alignItems: "items-end",
          textAlign: "text-center",
        },
      },
    ],
  },
};

// ============================================================================
// TEXT PRESETS
// ============================================================================

export const textPresets = {
  styles: {
    label: "Text Styles",
    type: "select" as const,
    propKey: "presetStyle",
    propType: "root",
    help: "Choose from professionally designed text styles",
    items: [
      {
        title: "Hero Title",
        var: "hero-title",
        mobile: {
          fontSize: "text-5xl",
          fontWeight: "font-[var(--ph-heading-font)]",
          textAlign: "text-center",
          letterSpacing: "tracking-tight",
          lineHeight: "leading-tight",
        },
        desktop: {
          fontSize: "text-7xl",
        },
        root: {
          tagName: "h1",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Page Title",
        var: "page-title",
        mobile: {
          fontSize: "text-4xl",
          fontWeight: "font-[var(--ph-heading-font)]",
          letterSpacing: "tracking-tight",
          lineHeight: "leading-tight",
        },
        desktop: {
          fontSize: "text-6xl",
        },
        root: {
          tagName: "h1",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Section Heading",
        var: "section-heading",
        mobile: {
          fontSize: "text-3xl",
          fontWeight: "font-[var(--ph-heading-font)]",
          letterSpacing: "tracking-tight",
        },
        desktop: {
          fontSize: "text-4xl",
        },
        root: {
          tagName: "h2",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Card Heading",
        var: "card-heading",
        mobile: {
          fontSize: "text-xl",
          fontWeight: "font-[var(--ph-heading-font)]",
          lineHeight: "leading-snug",
        },
        desktop: {
          fontSize: "text-2xl",
        },
        root: {
          tagName: "h3",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Body Text",
        var: "body-text",
        mobile: {
          fontSize: "text-base",
          fontWeight: "font-[var(--ph-body-font)]",
          lineHeight: "leading-relaxed",
        },
        desktop: {
          fontSize: "text-lg",
        },
        root: {
          tagName: "p",
          fontFamily: "var(--ph-body-font-family)",
        },
      },
      {
        title: "Lead Paragraph",
        var: "lead-paragraph",
        mobile: {
          fontSize: "text-lg",
          fontWeight: "font-[var(--ph-body-font)]",
          lineHeight: "leading-relaxed",
        },
        desktop: {
          fontSize: "text-xl",
        },
        root: {
          tagName: "p",
          fontFamily: "var(--ph-body-font-family)",
        },
      },
      {
        title: "Quote / Pullquote",
        var: "quote",
        mobile: {
          fontSize: "text-2xl",
          fontWeight: "font-[var(--ph-body-font)]",
          fontStyle: "italic",
          lineHeight: "leading-relaxed",
          textAlign: "text-center",
        },
        desktop: {
          fontSize: "text-3xl",
        },
        root: {
          tagName: "blockquote",
          fontFamily: "var(--ph-body-font-family)",
        },
      },
      {
        title: "Button Text",
        var: "button-text",
        mobile: {
          fontSize: "text-sm",
          fontWeight: "font-[var(--ph-heading-font)]",
          letterSpacing: "tracking-wide",
          textTransform: "uppercase",
        },
        desktop: {
          fontSize: "text-base",
        },
        root: {
          tagName: "span",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Caption / Small",
        var: "caption",
        mobile: {
          fontSize: "text-sm",
          fontWeight: "font-[var(--ph-body-font)]",
          lineHeight: "leading-snug",
        },
        root: {
          tagName: "p",
          fontFamily: "var(--ph-body-font-family)",
        },
      },
      {
        title: "Overline / Label",
        var: "overline",
        mobile: {
          fontSize: "text-xs",
          fontWeight: "font-[var(--ph-heading-font)]",
          letterSpacing: "tracking-widest",
          textTransform: "uppercase",
        },
        root: {
          tagName: "span",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Eyebrow / Kicker",
        var: "eyebrow",
        mobile: {
          fontSize: "text-sm",
          fontWeight: "font-[var(--ph-heading-font)]",
          letterSpacing: "tracking-wider",
          textTransform: "uppercase",
        },
        root: {
          tagName: "span",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Subtitle / Subheading",
        var: "subtitle",
        mobile: {
          fontSize: "text-lg",
          fontWeight: "font-[var(--ph-body-font)]",
          lineHeight: "leading-normal",
        },
        desktop: {
          fontSize: "text-xl",
        },
        root: {
          tagName: "p",
          fontFamily: "var(--ph-body-font-family)",
        },
      },
      {
        title: "Feature Number",
        var: "feature-number",
        mobile: {
          fontSize: "text-6xl",
          fontWeight: "font-[var(--ph-heading-font)]",
          lineHeight: "leading-none",
          letterSpacing: "tracking-tighter",
        },
        desktop: {
          fontSize: "text-8xl",
        },
        root: {
          tagName: "div",
          fontFamily: "var(--ph-heading-font-family)",
        },
      },
      {
        title: "Testimonial Text",
        var: "testimonial",
        mobile: {
          fontSize: "text-lg",
          fontWeight: "font-[var(--ph-body-font)]",
          fontStyle: "italic",
          lineHeight: "leading-relaxed",
        },
        desktop: {
          fontSize: "text-xl",
        },
        root: {
          tagName: "p",
          fontFamily: "var(--ph-body-font-family)",
        },
      },
    ],
  },

  sizes: {
    label: "Text Sizes",
    type: "slider" as const,
    propKey: "preset",
    propType: "root",
    help: "Choose from predefined text sizes",
    items: [
      {
        title: "Display Large",
        var: "display-lg",
        mobile: {
          fontSize: "text-6xl",
          fontWeight: "font-bold",
        },
        root: {
          tagName: "h1",
        },
      },
      {
        title: "Display",
        var: "display",
        mobile: {
          fontSize: "text-5xl",
          fontWeight: "font-bold",
        },
        root: {
          tagName: "h1",
        },
      },
      {
        title: "Heading 1",
        var: "h1",
        mobile: {
          fontSize: "text-4xl",
          fontWeight: "font-bold",
        },
        root: {
          tagName: "h1",
        },
      },
      {
        title: "Heading 2",
        var: "h2",
        mobile: {
          fontSize: "text-3xl",
          fontWeight: "font-bold",
        },
        root: {
          tagName: "h2",
        },
      },
      {
        title: "Heading 3",
        var: "h3",
        mobile: {
          fontSize: "text-2xl",
          fontWeight: "font-semibold",
        },
        root: {
          tagName: "h3",
        },
      },
      {
        title: "Heading 4",
        var: "h4",
        mobile: {
          fontSize: "text-xl",
          fontWeight: "font-semibold",
        },
        root: {
          tagName: "h4",
        },
      },
      {
        title: "Heading 5",
        var: "h5",
        mobile: {
          fontSize: "text-lg",
          fontWeight: "font-medium",
        },
        root: {
          tagName: "h5",
        },
      },
      {
        title: "Heading 6",
        var: "h6",
        mobile: {
          fontSize: "text-base",
          fontWeight: "font-medium",
        },
        root: {
          tagName: "h6",
        },
      },
      {
        title: "Body Large",
        var: "body-lg",
        mobile: {
          fontSize: "text-lg",
          fontWeight: "font-normal",
        },
        root: {
          tagName: "p",
        },
      },
      {
        title: "Body",
        var: "body",
        mobile: {
          fontSize: "text-base",
          fontWeight: "font-normal",
        },
        root: {
          tagName: "p",
        },
      },
      {
        title: "Body Small",
        var: "body-sm",
        mobile: {
          fontSize: "text-sm",
          fontWeight: "font-normal",
        },
        root: {
          tagName: "p",
        },
      },
      {
        title: "Caption",
        var: "caption",
        mobile: {
          fontSize: "text-xs",
          fontWeight: "font-normal",
        },
        root: {
          tagName: "p",
        },
      },
    ],
  },
};

// ============================================================================
// BUTTON PRESETS
// ============================================================================

export const buttonPresets = {
  sizes: {
    label: "Button Size",
    type: "slider" as const,
    propKey: "presetSize",
    propType: "root",
    items: [
      {
        title: "Small",
        var: "btn-sm",
        mobile: {
          px: "px-3",
          py: "py-1.5",
          fontSize: "text-sm",
        },
      },
      {
        title: "Medium",
        var: "btn-md",
        mobile: {
          px: "px-4",
          py: "py-2",
          fontSize: "text-base",
        },
      },
      {
        title: "Large",
        var: "btn-lg",
        mobile: {
          px: "px-6",
          py: "py-3",
          fontSize: "text-lg",
        },
      },
      {
        title: "Extra Large",
        var: "btn-xl",
        mobile: {
          px: "px-8",
          py: "py-4",
          fontSize: "text-xl",
        },
      },
    ],
  },

  styles: {
    label: "Button Style",
    type: "select" as const,
    propKey: "presetStyle",
    propType: "root",
    items: [
      {
        title: "Primary",
        var: "btn-primary",
        root: {
          background: "bg-[var(--ph-primary)]",
          color: "bg-[var(--ph-primary-text)]",
          radius: "rounded-[var(--ph-border-radius)]",
          shadow: "shadow-[var(--ph-shadow-style)]",
        },
        mobile: {
          px: "px-[var(--ph-button-padding-x)]",
          py: "py-[var(--ph-button-padding-y)]",
        },
      },
      {
        title: "Secondary",
        var: "btn-secondary",
        root: {
          background: "bg-[var(--ph-secondary)]",
          color: "bg-[var(--ph-secondary-text)]",
          radius: "rounded-[var(--ph-border-radius)]",
        },
        mobile: {
          px: "px-[var(--ph-button-padding-x)]",
          py: "py-[var(--ph-button-padding-y)]",
        },
      },
      {
        title: "Outline",
        var: "btn-outline",
        root: {
          background: "bg-transparent",
          color: "text-[var(--ph-primary)]",
          border: "border",
          borderColor: "border-[var(--ph-primary)]",
          radius: "rounded-[var(--ph-border-radius)]",
        },
        mobile: {
          px: "px-[var(--ph-button-padding-x)]",
          py: "py-[var(--ph-button-padding-y)]",
        },
      },
      {
        title: "Ghost",
        var: "btn-ghost",
        root: {
          background: "bg-transparent",
          color: "text-[var(--ph-primary)]",
        },
        mobile: {
          px: "px-[var(--ph-button-padding-x)]",
          py: "py-[var(--ph-button-padding-y)]",
        },
      },
    ],
  },
};

// ============================================================================
// SPACER PRESETS
// ============================================================================

export const spacerPresets = {
  heights: {
    label: "Spacer Height",
    type: "slider" as const,
    propKey: "presetHeight",
    propType: "root",
    items: [
      {
        title: "Extra Small",
        var: "spacer-xs",
        mobile: {
          height: "h-2",
        },
      },
      {
        title: "Small",
        var: "spacer-sm",
        mobile: {
          height: "h-4",
        },
      },
      {
        title: "Medium",
        var: "spacer-md",
        mobile: {
          height: "h-8",
        },
      },
      {
        title: "Large",
        var: "spacer-lg",
        mobile: {
          height: "h-16",
        },
      },
      {
        title: "Extra Large",
        var: "spacer-xl",
        mobile: {
          height: "h-24",
        },
      },
      {
        title: "2XL",
        var: "spacer-2xl",
        mobile: {
          height: "h-32",
        },
      },
    ],
  },
};

// ============================================================================
// IMAGE PRESETS
// ============================================================================

export const imagePresets = {
  aspectRatios: {
    label: "Aspect Ratio",
    type: "select" as const,
    propKey: "presetAspectRatio",
    propType: "mobile",
    items: [
      {
        title: "Square",
        var: "aspect-square",
        mobile: {
          aspectRatio: "aspect-square",
        },
      },
      {
        title: "Video (16:9)",
        var: "aspect-video",
        mobile: {
          aspectRatio: "aspect-video",
        },
      },
      {
        title: "Portrait (3:4)",
        var: "aspect-3/4",
        mobile: {
          aspectRatio: "aspect-[3/4]",
        },
      },
      {
        title: "Landscape (4:3)",
        var: "aspect-4/3",
        mobile: {
          aspectRatio: "aspect-[4/3]",
        },
      },
    ],
  },

  sizes: {
    label: "Image Size",
    type: "select" as const,
    propKey: "presetSize",
    propType: "mobile",
    items: [
      {
        title: "Small",
        var: "img-sm",
        mobile: {
          width: "w-24",
          height: "h-24",
        },
      },
      {
        title: "Medium",
        var: "img-md",
        mobile: {
          width: "w-48",
          height: "h-48",
        },
      },
      {
        title: "Large",
        var: "img-lg",
        mobile: {
          width: "w-64",
          height: "h-64",
        },
      },
      {
        title: "Full Width",
        var: "img-full",
        mobile: {
          width: "w-full",
          height: "h-auto",
        },
      },
    ],
  },
};

// ============================================================================
// FORM PRESETS
// ============================================================================

export const formPresets = {
  inputSizes: {
    label: "Input Size",
    type: "slider" as const,
    propKey: "presetInputSize",
    propType: "root",
    items: [
      {
        title: "Small",
        var: "input-sm",
        mobile: {
          px: "px-2",
          py: "py-1",
          fontSize: "text-sm",
        },
      },
      {
        title: "Medium",
        var: "input-md",
        mobile: {
          px: "px-3",
          py: "py-2",
          fontSize: "text-base",
        },
      },
      {
        title: "Large",
        var: "input-lg",
        mobile: {
          px: "px-4",
          py: "py-3",
          fontSize: "text-lg",
        },
      },
    ],
  },
};

// ============================================================================
// DIVIDER PRESETS
// ============================================================================

export const dividerPresets = {
  thickness: {
    label: "Thickness",
    type: "slider" as const,
    propKey: "presetThickness",
    propType: "root",
    help: "Adjust the thickness of the divider",
    items: [
      {
        title: "Hair",
        var: "divider-hair",
        mobile: {
          height: "h-px",
        },
      },
      {
        title: "Thin",
        var: "divider-thin",
        mobile: {
          height: "h-0.5",
        },
      },
      {
        title: "Regular",
        var: "divider-regular",
        mobile: {
          height: "h-1",
        },
      },
      {
        title: "Medium",
        var: "divider-medium",
        mobile: {
          height: "h-2",
        },
      },
      {
        title: "Thick",
        var: "divider-thick",
        mobile: {
          height: "h-4",
        },
      },
      {
        title: "Extra Thick",
        var: "divider-xthick",
        mobile: {
          height: "h-8",
        },
      },
    ],
  },
};

// ============================================================================
// FORM ELEMENT PRESETS
// ============================================================================

export const formElementPresets = {
  size: {
    label: "Input Size",
    type: "slider" as const,
    propKey: "presetSize",
    propType: "root",
    help: "Adjust the size of form inputs",
    items: [
      {
        title: "Small",
        var: "input-sm",
        mobile: {
          px: "px-2",
          py: "py-1",
          fontSize: "text-sm",
        },
      },
      {
        title: "Medium",
        var: "input-md",
        mobile: {
          px: "px-3",
          py: "py-2",
          fontSize: "text-base",
        },
      },
      {
        title: "Large",
        var: "input-lg",
        mobile: {
          px: "px-4",
          py: "py-3",
          fontSize: "text-lg",
        },
      },
    ],
  },

  style: {
    label: "Input Style",
    type: "select" as const,
    propKey: "presetStyle",
    propType: "root",
    items: [
      {
        title: "Outlined",
        var: "input-outlined",
        root: {
          border: "border",
          borderColor: "border-gray-300",
          background: "bg-white",
          radius: "rounded-[var(--ph-border-radius)]",
        },
      },
      {
        title: "Filled",
        var: "input-filled",
        root: {
          border: "border-0",
          background: "bg-gray-100",
          radius: "rounded-[var(--ph-border-radius)]",
        },
      },
      {
        title: "Underlined",
        var: "input-underlined",
        root: {
          border: "border-0",
          borderBottom: "border-b",
          borderColor: "border-gray-300",
          background: "bg-transparent",
          radius: "rounded-none",
        },
      },
    ],
  },
};

// ============================================================================
// EXPORT ALL PRESETS
// ============================================================================

export const selectorPresets = {
  container: containerPresets,
  backgroundImage: backgroundImagePresets,
  text: textPresets,
  button: buttonPresets,
  spacer: spacerPresets,
  image: imagePresets,
  form: formPresets,
  divider: dividerPresets,
  formElement: formElementPresets,
};

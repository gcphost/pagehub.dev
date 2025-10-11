// Function to handle opacity modifiers with CSS variables
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `hsl(from var(${variableName}) h s l / ${opacityValue})`;
    }
    return `var(${variableName})`;
  };
}

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Safelist patterns for dynamically generated classes with CSS variables
    // { pattern: /^(bg|text|border|ring|from|to|via)-\[var\(--ph-.+\)\]$/ },
    //  { pattern: /^(bg|text|border|ring)-\[var\(--ph-.+\)\]$/ },
  ],
  theme: {
    height: (theme) => ({
      auto: "auto",
      ...theme("spacing"),
      full: "100%",
      screen: "calc(var(--vh) * 100)",
    }),
    extend: {
      colors: {
        // Tweakcn colors with opacity support
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        card: withOpacity('--card'),
        "card-foreground": withOpacity('--card-foreground'),
        popover: withOpacity('--popover'),
        "popover-foreground": withOpacity('--popover-foreground'),
        primary: withOpacity('--primary'),
        "primary-foreground": withOpacity('--primary-foreground'),
        secondary: withOpacity('--secondary'),
        "secondary-foreground": withOpacity('--secondary-foreground'),
        muted: withOpacity('--muted'),
        "muted-foreground": withOpacity('--muted-foreground'),
        accent: withOpacity('--accent'),
        "accent-foreground": withOpacity('--accent-foreground'),
        destructive: withOpacity('--destructive'),
        "destructive-foreground": withOpacity('--destructive-foreground'),
        border: withOpacity('--border'),
        input: withOpacity('--input'),
        ring: withOpacity('--ring'),

        // Chart colors
        "chart-1": withOpacity('--chart-1'),
        "chart-2": withOpacity('--chart-2'),
        "chart-3": withOpacity('--chart-3'),
        "chart-4": withOpacity('--chart-4'),
        "chart-5": withOpacity('--chart-5'),

        // Sidebar colors
        sidebar: withOpacity('--sidebar'),
        "sidebar-foreground": withOpacity('--sidebar-foreground'),
        "sidebar-primary": withOpacity('--sidebar-primary'),
        "sidebar-primary-foreground": withOpacity('--sidebar-primary-foreground'),
        "sidebar-accent": withOpacity('--sidebar-accent'),
        "sidebar-accent-foreground": withOpacity('--sidebar-accent-foreground'),
        "sidebar-border": withOpacity('--sidebar-border'),
        "sidebar-ring": withOpacity('--sidebar-ring'),

        // Legacy colors (keep for compatibility)
        "dar-gray": "#4b4b4b",
        "light-gray-0": "#eaeaea",
        "light-gray-1": "rgb(75,75,75)",
        "light-gray-2": "rgb(128,128,128)",
        "renderer-gray": "rgb(224, 224, 224)",
        red: "#e34850",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "sm": "var(--radius-sm)",
        "md": "0.375rem", // Keep original Tailwind value for compatibility
        "lg": "var(--radius-lg)",
        "xl": "var(--radius-xl)",
        // Tweakcn radius classes
        "tweakcn-sm": "var(--radius-sm)",
        "tweakcn-md": "var(--radius-md)",
        "tweakcn-lg": "var(--radius-lg)",
        "tweakcn-xl": "var(--radius-xl)",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        "xs": "var(--shadow-xs)",
        "sm": "var(--shadow-sm)",
        "md": "var(--shadow-md)",
        "lg": "var(--shadow-lg)",
        "xl": "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      letterSpacing: {
        "normal": "var(--tracking-normal)",
      },
      spacing: {
        "spacing": "var(--spacing)",
      },
    },
  },
  variants: {},
};

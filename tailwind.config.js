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
    },
  },
  variants: {},
};

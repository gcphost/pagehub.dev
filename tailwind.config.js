module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Match all color utilities with any shade
    { pattern: /^(bg|text|border|from|to|via)-.+-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    { pattern: /^(bg|text|border|from|to|via)-(white|black|transparent|current)$/ },

    // Match all spacing utilities
    { pattern: /^-?(m|p)(t|r|b|l|x|y)?-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/ },
    { pattern: /^gap-(x|y)?-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/ },
    { pattern: /^space-(x|y)-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/ },

    // Match all sizing utilities
    { pattern: /^(w|h|min-w|min-h|max-w|max-h)-.+$/ },

    // Match all border utilities
    { pattern: /^border(-[trbl])?-(0|2|4|8)$/ },
    { pattern: /^rounded(-[trbl]|-[trbl][trbl])?(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/ },

    // Match all flex/grid utilities
    { pattern: /^(flex|grid|justify|items|content|self|place)-.+$/ },

    // Match all text utilities
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/ },
    { pattern: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/ },
    { pattern: /^(text|font)-.+$/ },

    // Match all display utilities
    { pattern: /^(block|inline|inline-block|flex|inline-flex|grid|inline-grid|hidden)$/ },

    // Match all position utilities
    { pattern: /^(static|fixed|absolute|relative|sticky)$/ },
    { pattern: /^(top|right|bottom|left|inset)-.+$/ },

    // Match all opacity utilities
    { pattern: /^(opacity|bg-opacity|text-opacity|border-opacity)-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/ },

    // Match all shadow utilities
    { pattern: /^shadow-.+$/ },
    { pattern: /^drop-shadow-.+$/ },

    // Match transform utilities
    { pattern: /^(scale|rotate|translate|skew)-.+$/ },

    // Match transition utilities  
    { pattern: /^transition-.+$/ },
    { pattern: /^duration-.+$/ },
    { pattern: /^ease-.+$/ },
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
        primary: {
          50: "var(--primary-50, #f5f3ff)",
          100: "var(--primary-100, #ede9fe)",
          200: "var(--primary-200, #ddd6fe)",
          300: "var(--primary-300, #c4b5fd)",
          400: "var(--primary-400, #a78bfa)",
          500: "var(--primary-500, #8b5cf6)",
          600: "var(--primary-600, #7c3aed)",
          700: "var(--primary-700, #6d28d9)",
          800: "var(--primary-800, #5b21b6)",
          900: "var(--primary-900, #4c1d95)",
          950: "var(--primary-950, #2e1065)",
          DEFAULT: "var(--primary-color, #8b5cf6)",
        },
        secondary: {
          50: "var(--secondary-50, #ecfeff)",
          100: "var(--secondary-100, #cffafe)",
          200: "var(--secondary-200, #a5f3fc)",
          300: "var(--secondary-300, #67e8f9)",
          400: "var(--secondary-400, #22d3ee)",
          500: "var(--secondary-500, #06b6d4)",
          600: "var(--secondary-600, #0891b2)",
          700: "var(--secondary-700, #0e7490)",
          800: "var(--secondary-800, #155e75)",
          900: "var(--secondary-900, #164e63)",
          950: "var(--secondary-950, #083344)",
          DEFAULT: "var(--secondary-color, #06b6d4)",
        },
        accent: {
          50: "var(--accent-50, #ffffff)",
          100: "var(--accent-100, #f8fafc)",
          200: "var(--accent-200, #f1f5f9)",
          300: "var(--accent-300, #e2e8f0)",
          400: "var(--accent-400, #cbd5e1)",
          500: "var(--accent-500, #94a3b8)",
          600: "var(--accent-600, #64748b)",
          700: "var(--accent-700, #475569)",
          800: "var(--accent-800, #334155)",
          900: "var(--accent-900, #1e293b)",
          950: "var(--accent-950, #0f172a)",
          DEFAULT: "var(--accent-color, #ffffff)",
        },
        "dar-gray": "#4b4b4b",
        "light-gray-0": "#eaeaea",
        "light-gray-1": "rgb(75,75,75)",
        "light-gray-2": "rgb(128,128,128)",
        "renderer-gray": "rgb(224, 224, 224)",
        red: "#e34850",
        "green-400": "#2d9d78",
        "green-500": "#268e6c",
      },
    },
  },
  variants: {},
};

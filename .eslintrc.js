module.exports = {
  extends: ["next/core-web-vitals", "plugin:tailwindcss/recommended"],
  plugins: ["tailwindcss"],
  rules: {
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "warn",
    "tailwindcss/no-contradicting-classname": "error",
    "react-hooks/exhaustive-deps": "off",
  },
};

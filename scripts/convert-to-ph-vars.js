#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Inline the default style guide to avoid TypeScript import issues
const DEFAULT_STYLE_GUIDE = {
  inputBorderWidth: "1px",
  inputBorderColor: "palette:Neutral",
  inputBorderRadius: "0.375rem",
  inputPadding: "1rem 1rem",
  inputBgColor: "white",
  inputTextColor: "gray-900",
  inputPlaceholderColor: "gray-400",
  inputFocusRing: "2px",
  inputFocusRingColor: "palette:Primary",
  borderRadius: "rounded-lg",
  buttonPadding: "px-6 py-3",
  headingFontFamily: "Inter",
  bodyFontFamily: "Inter",
  headingFont: "font-semibold",
  linkColor: "palette:Primary",
  linkHoverColor: "palette:Secondary",
};

// Convert name to CSS variable name
function toCSSVarName(name) {
  return name
    .replace(/([A-Z])/g, "-$1") // Add hyphen before capitals
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase()
    .replace(/^-/, ""); // Remove leading hyphen
}

// Convert palette reference to CSS variable
function convertPaletteReference(value) {
  if (typeof value === "string") {
    if (value.startsWith("palette:")) {
      const name = value.replace("palette:", "").trim();
      const varName = toCSSVarName(name);
      return `var(--ph-${varName})`;
    }
    // Also convert existing --palette- references to --ph-
    if (value.includes("--palette-")) {
      return value.replace(/--palette-/g, "--ph-");
    }
  }
  return value;
}

// Convert style reference to CSS variable or direct class
function convertStyleReference(value) {
  if (typeof value === "string") {
    if (value.startsWith("style:")) {
      const styleName = value.replace("style:", "").trim();

      // Check if this should be a CSS variable (actual CSS values)
      const cssVarKeys = [
        "inputBorderColor",
        "inputBgColor",
        "inputTextColor",
        "inputPlaceholderColor",
        "inputFocusRingColor",
        "linkColor",
        "linkHoverColor",
        "inputBorderWidth",
        "inputBorderRadius",
        "inputPadding",
        "inputFocusRing",
      ];

      if (cssVarKeys.includes(styleName)) {
        const varName = toCSSVarName(styleName);
        return `var(--ph-${varName})`;
      } else {
        // For utility classes, return the actual value from style guide
        return DEFAULT_STYLE_GUIDE[styleName] || value;
      }
    }
    // Also convert existing --style- references to --ph-
    if (value.includes("--style-")) {
      return value.replace(/--style-/g, "--ph-");
    }
  }
  return value;
}

// Recursively process object values
function processObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(processObject);
  } else if (obj && typeof obj === "object") {
    const processed = {};
    for (const [key, value] of Object.entries(obj)) {
      processed[key] = processObject(value);
    }
    return processed;
  } else if (typeof obj === "string") {
    // First try style references, then palette references
    let processed = convertStyleReference(obj);
    processed = convertPaletteReference(processed);
    return processed;
  }
  return obj;
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);
    const processed = processObject(data);

    fs.writeFileSync(filePath, JSON.stringify(processed, null, 2));
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
function main() {
  const templatesDir = path.join(__dirname, "..", "data", "section-templates");

  // Process individual template files
  const files = fs
    .readdirSync(templatesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join(templatesDir, file));

  files.forEach(processFile);

  // Process main section-templates.json
  const mainFile = path.join(__dirname, "..", "data", "section-templates.json");
  if (fs.existsSync(mainFile)) {
    processFile(mainFile);
  }

  console.log(
    "\n🎉 Conversion complete! All files now use --ph- prefixed CSS variables.",
  );
}

if (require.main === module) {
  main();
}

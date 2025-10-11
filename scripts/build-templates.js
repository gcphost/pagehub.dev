const fs = require("fs");
const path = require("path");

console.log("🔄 Building section-templates.json from modular files...");

// Load the modular templates
const templatesDir = path.join(__dirname, "../data/section-templates");
const templateData = require(path.join(templatesDir, "index.js"));

// Create the combined structure
const combinedData = {
  categories: templateData.categories,
  templates: templateData.templates,
};

// Write back to the main file
const mainFilePath = path.join(__dirname, "../data/section-templates.json");
fs.writeFileSync(mainFilePath, JSON.stringify(combinedData, null, 2));

console.log("✅ Updated main section-templates.json with modular data");
console.log(`📁 Categories: ${templateData.categories.length}`);
console.log(
  `📄 Total templates: ${Object.values(templateData.templates).flat().length}`,
);
console.log(
  `📊 File size: ${(fs.statSync(mainFilePath).size / 1024).toFixed(1)} KB`,
);

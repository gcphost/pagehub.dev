const fs = require("fs");
const path = require("path");

const templatesDir = __dirname;
const categories = [];
const templates = {};

// Load all category files
fs.readdirSync(templatesDir).forEach((file) => {
  if (file.endsWith(".json") && file !== "index.json" && file !== "index.js") {
    const categoryData = JSON.parse(
      fs.readFileSync(path.join(templatesDir, file), "utf8"),
    );
    categories.push({
      id: categoryData.id,
      name: categoryData.name,
    });
    templates[categoryData.id] = categoryData.templates;
  }
});

module.exports = {
  categories: categories,
  templates: templates,
};

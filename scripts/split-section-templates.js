const fs = require('fs');
const path = require('path');

// Read the main section templates file
const templatesPath = path.join(__dirname, '../data/section-templates.json');
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

// Create output directory
const outputDir = path.join(__dirname, '../data/section-templates');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write each category to its own file
Object.entries(templates.templates).forEach(([categoryKey, sections]) => {
  // Find the category name from the categories array
  const category = templates.categories.find(cat => cat.id === categoryKey);
  const categoryName = category ? category.name : categoryKey;

  const filename = `${categoryKey}.json`;
  const filepath = path.join(outputDir, filename);

  const categoryData = {
    id: categoryKey,
    name: categoryName,
    templates: sections
  };

  fs.writeFileSync(filepath, JSON.stringify(categoryData, null, 2));
  console.log(`Created ${filename} with ${sections.length} templates (${categoryName})`);
});

// Create an index file that imports all categories
const indexContent = `const fs = require('fs');
const path = require('path');

const templatesDir = __dirname;
const categories = [];
const templates = {};

// Load all category files
fs.readdirSync(templatesDir).forEach(file => {
  if (file.endsWith('.json') && file !== 'index.json' && file !== 'index.js') {
    const categoryData = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
    categories.push({
      id: categoryData.id,
      name: categoryData.name
    });
    templates[categoryData.id] = categoryData.templates;
  }
});

module.exports = {
  categories: categories,
  templates: templates
};`;

fs.writeFileSync(path.join(outputDir, 'index.js'), indexContent);

// Create a simple JSON index for easier access
const jsonIndex = {
  categories: templates.categories,
  templates: templates.templates
};

fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(jsonIndex, null, 2));

console.log(`\nSplit complete! Created ${Object.keys(templates.templates).length} category files.`);
console.log('Categories:', Object.keys(templates.templates).join(', '));

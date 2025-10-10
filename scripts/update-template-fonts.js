/**
 * Update Section Template Fonts
 * 
 * This script:
 * 1. Replaces hardcoded font families with design system variables
 * 2. Headers (h1-h6) use var(--ph-heading-font-family)
 * 3. Non-headers inherit from body (remove fontFamily prop)
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '../data/section-templates');
const HEADER_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// Font families to replace (case-insensitive)
const OLD_FONTS = [
  'Open Sans',
  'Open Sans',
  'Roboto, sans-serif',
  'Roboto',
  'Lato, sans-serif',
  'Lato',
];

function isHeaderTag(tagName) {
  return tagName && HEADER_TAGS.includes(tagName.toLowerCase());
}

function updateFontFamily(node, depth = 0) {
  if (!node || typeof node !== 'object') return node;

  // Check if this is a Text component
  const isTextComponent = node.type === 'Text';
  const tagName = node.props?.root?.tagName;

  // Update this node's font
  if (node.props?.root?.fontFamily) {
    const currentFont = node.props.root.fontFamily;

    // Check if it's an old font that should be replaced
    const shouldReplace = OLD_FONTS.some(oldFont =>
      currentFont.toLowerCase().includes(oldFont.toLowerCase())
    );

    if (shouldReplace) {
      // For Text components, check the text content to determine if it's likely a header
      const text = node.props?.text || '';
      const displayName = node.props?.custom?.displayName || '';
      const isLikelyHeader =
        isHeaderTag(tagName) ||
        displayName.toLowerCase().includes('title') ||
        displayName.toLowerCase().includes('heading') ||
        (isTextComponent && node.props?.mobile?.fontSize &&
          ['text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl'].some(size =>
            node.props.mobile.fontSize.includes(size)
          ));

      if (isLikelyHeader) {
        // Headers get heading font
        node.props.root.fontFamily = 'var(--ph-heading-font-family)';
        console.log(`  ✓ Updated "${displayName || 'Text'}" to heading font`);
      } else {
        // Non-headers inherit from body (remove fontFamily)
        delete node.props.root.fontFamily;
        console.log(`  ✓ Removed fontFamily from "${displayName || 'Text'}" (inherits from body)`);
      }
    }
  }

  // Recursively update children
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(child => updateFontFamily(child, depth + 1));
  }

  return node;
}

function processTemplate(filePath) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const template = JSON.parse(data);

    // Check if this is a section template file (has templates array)
    if (template.templates && Array.isArray(template.templates)) {
      template.templates.forEach((tmpl, index) => {
        console.log(`  📋 Template ${index + 1}: ${tmpl.name}`);
        if (tmpl.structure) {
          updateFontFamily(tmpl.structure);
        }
      });
    }
    // Or if it's a Craft.js serialized format
    else if (template.ROOT) {
      Object.keys(template).forEach(nodeId => {
        if (template[nodeId]) {
          updateFontFamily(template[nodeId]);
        }
      });
    }

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf8');
    console.log(`  ✅ Saved`);
  } catch (error) {
    console.error(`  ❌ Error processing ${path.basename(filePath)}:`, error.message);
  }
}

function main() {
  console.log('🎨 Updating section template fonts...\n');
  console.log('Rules:');
  console.log('  • Headers (h1-h6) → var(--ph-heading-font-family)');
  console.log('  • Other text → remove fontFamily (inherit from body)');
  console.log('  • Body font set on Background component');

  // Get all JSON files except index.json
  const files = fs.readdirSync(TEMPLATES_DIR)
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .map(file => path.join(TEMPLATES_DIR, file));

  files.forEach(processTemplate);

  console.log('\n✨ Done! All templates updated.');
}

main();


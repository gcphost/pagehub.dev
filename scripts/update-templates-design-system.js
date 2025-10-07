const fs = require('fs');
const path = require('path');

// Design system mappings
const DESIGN_SYSTEM_MAPPINGS = {
  // Button mappings
  button: {
    // Border radius
    'radius': {
      'rounded-lg': 'style:borderRadius',
      'rounded-md': 'style:borderRadius',
      'rounded': 'style:borderRadius',
      'rounded-full': 'rounded-full', // Keep full rounded as-is (special case)
    },
    // Padding - convert to style:buttonPadding
    'px': {
      'px-8': 'style:buttonPadding',
      'px-6': 'style:buttonPadding',
      'px-4': 'style:buttonPadding',
    },
    'py': {
      'py-4': null, // Remove when px is converted
      'py-3': null,
      'py-2': null,
    },
    'p': {
      'px-8 py-4': 'style:buttonPadding',
      'px-6 py-3': 'style:buttonPadding',
      'px-4 py-2': 'style:buttonPadding',
    },
    // Font weight
    'fontWeight': {
      'font-bold': 'style:headingFont',
      'font-semibold': 'style:headingFont',
    },
    // Shadow
    'shadow': {
      'shadow-lg': 'style:shadowStyle',
      'shadow-md': 'style:shadowStyle',
      'shadow': 'style:shadowStyle',
    },
    // Color mappings
    'color': {
      'text-primary-500': 'text-palette:Primary',
      'text-white': 'text-white', // Keep as-is
    },
    'background': {
      'bg-primary-500': 'bg-palette:Primary',
      'bg-primary-600': 'bg-palette:Primary',
    }
  },

  // Text mappings (headings)
  heading: {
    'fontWeight': {
      'font-bold': 'style:headingFont',
      'font-semibold': 'style:headingFont',
      'font-extrabold': 'style:headingFont',
    }
  },

  // Text mappings (body)
  body: {
    'fontWeight': {
      'font-normal': 'style:bodyFont',
      'font-light': 'style:bodyFont',
    }
  },

  // Container mappings
  container: {
    'p': {
      'p-8': 'style:containerSpacing',
      'p-6': 'style:containerSpacing',
    }
  }
};

// Determine if a text element is a heading based on fontSize or context
function isHeading(props, displayName = '') {
  const name = displayName.toLowerCase();
  if (name.includes('title') || name.includes('heading')) return true;

  const fontSize = props.mobile?.fontSize || '';
  // text-3xl and above are typically headings
  if (fontSize.match(/text-(3xl|4xl|5xl|6xl|7xl|8xl|9xl)/)) return true;

  return false;
}

// Process a single node recursively
function processNode(node, parentType = null) {
  if (!node || !node.props) return node;

  const type = node.type;
  const props = node.props;
  const displayName = props.custom?.displayName || '';

  // Process based on type
  if (type === 'Button') {
    // Add fontFamily to root if not present
    if (!props.root) props.root = {};
    if (!props.root.fontFamily) {
      props.root.fontFamily = 'style:headingFontFamily';
    }

    // Add shadow to root if not present
    if (!props.root.shadow && !props.mobile?.shadow) {
      props.root.shadow = 'style:shadowStyle';
    }

    // Convert padding
    if (props.mobile) {
      const mobile = props.mobile;

      // If has both px and py, combine to p with style guide
      if (mobile.px && mobile.py) {
        mobile.p = 'style:buttonPadding';
        delete mobile.px;
        delete mobile.py;
      } else if (mobile.px) {
        mobile.p = 'style:buttonPadding';
        delete mobile.px;
      }

      // Convert fontWeight
      if (mobile.fontWeight === 'font-bold' || mobile.fontWeight === 'font-semibold') {
        mobile.fontWeight = 'style:headingFont';
      }

      // Convert radius
      if (mobile.radius && mobile.radius !== 'rounded-full') {
        mobile.radius = 'style:borderRadius';
      }

      // Convert shadow
      if (mobile.shadow && mobile.shadow.startsWith('shadow')) {
        mobile.shadow = 'style:shadowStyle';
      }
    }

    // Convert colors in root
    if (props.root) {
      if (props.root.color && props.root.color.includes('primary')) {
        props.root.color = 'text-palette:Primary';
      }
      if (props.root.background && props.root.background.includes('primary')) {
        props.root.background = 'bg-palette:Primary';
      }
      if (props.root.radius && props.root.radius !== 'rounded-full') {
        props.root.radius = 'style:borderRadius';
      }
    }
  }

  if (type === 'Text') {
    const isHeadingText = isHeading(props, displayName);

    // Add fontFamily to root for headings
    if (isHeadingText) {
      if (!props.root) props.root = {};
      if (!props.root.fontFamily) {
        props.root.fontFamily = 'style:headingFontFamily';
      }
    }

    // Convert fontWeight
    if (props.mobile) {
      const mobile = props.mobile;

      if (isHeadingText) {
        if (mobile.fontWeight && mobile.fontWeight.match(/font-(bold|semibold|extrabold)/)) {
          mobile.fontWeight = 'style:headingFont';
        }
      } else {
        if (mobile.fontWeight && mobile.fontWeight.match(/font-(normal|light)/)) {
          mobile.fontWeight = 'style:bodyFont';
        }
      }
    }
  }

  if (type === 'Container') {
    // Convert container padding
    if (props.mobile) {
      const mobile = props.mobile;

      if (mobile.p && (mobile.p === 'p-8' || mobile.p === 'p-6' || mobile.p === 'p-4' || mobile.p === 'p-12')) {
        mobile.p = 'style:containerSpacing';
      }

      // Convert px/py to p
      if (mobile.px && mobile.py) {
        const pxVal = parseInt(mobile.px.match(/\d+/)?.[0] || '0');
        const pyVal = parseInt(mobile.py.match(/\d+/)?.[0] || '0');
        if (pxVal >= 4 && pyVal >= 2) {
          mobile.p = 'style:containerSpacing';
          delete mobile.px;
          delete mobile.py;
        }
      }

      // Convert gap
      if (mobile.gap) {
        const gapVal = parseInt(mobile.gap.match(/\d+/)?.[0] || '0');
        // Container gaps (2-12)
        if (gapVal >= 2 && gapVal <= 12) {
          mobile.gap = 'style:containerGap';
        }
        // Section gaps (16+)
        else if (gapVal >= 16) {
          mobile.gap = 'style:sectionGap';
        }
      }

      // Convert maxWidth
      if (mobile.maxWidth && mobile.maxWidth.startsWith('max-w-') && mobile.maxWidth !== 'max-w-full') {
        mobile.maxWidth = 'style:contentWidth';
      }
    }
  }

  // Process children recursively
  if (node.children && Array.isArray(node.children)) {
    node.children = node.children.map(child => processNode(child, type));
  }

  return node;
}

// Process a template file
function processTemplateFile(filePath) {
  console.log(`Processing: ${filePath}`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (!data.templates || !Array.isArray(data.templates)) {
      console.log(`  ⚠️  Skipping - no templates array found`);
      return;
    }

    let changeCount = 0;

    // Process each template
    data.templates.forEach((template, index) => {
      if (template.structure) {
        const before = JSON.stringify(template.structure);
        template.structure = processNode(template.structure);
        const after = JSON.stringify(template.structure);

        if (before !== after) {
          changeCount++;
          console.log(`  ✓ Updated template: ${template.name || template.id}`);
        }
      }
    });

    if (changeCount > 0) {
      // Write back with pretty formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  ✅ Saved ${changeCount} template(s) with design system updates`);
    } else {
      console.log(`  ℹ️  No changes needed`);
    }

  } catch (error) {
    console.error(`  ❌ Error processing file: ${error.message}`);
  }
}

// Main execution
function main() {
  const templatesDir = path.join(__dirname, '..', 'data', 'section-templates');

  console.log('🎨 Updating templates with design system...\n');

  // Get all JSON files except index.json
  const files = fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .map(file => path.join(templatesDir, file));

  files.forEach(file => {
    processTemplateFile(file);
    console.log('');
  });

  console.log('✨ Done! Run "npm run build-templates" to rebuild the combined template file.');
}

main();

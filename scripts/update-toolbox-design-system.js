const fs = require('fs');
const path = require('path');

// Process button props to use design system
function processButtonProps(props) {
  if (!props) return props;

  // Process root
  if (props.root) {
    // Add fontFamily if not present
    if (!props.root.fontFamily) {
      props.root.fontFamily = 'style:headingFontFamily';
    }

    // Add shadow if not present and not transparent background
    if (!props.root.shadow && props.root.background && props.root.background !== 'bg-transparent') {
      props.root.shadow = 'style:shadowStyle';
    }

    // Convert radius (except rounded-full which is special)
    if (props.root.radius && props.root.radius !== 'rounded-full') {
      props.root.radius = 'style:borderRadius';
    }

    // Convert palette colors
    if (props.root.background) {
      if (props.root.background.includes('primary')) {
        props.root.background = 'bg-palette:Primary';
      }
    }

    if (props.root.color) {
      if (props.root.color.includes('primary')) {
        props.root.color = 'text-palette:Primary';
      }
    }
  }

  // Process mobile
  if (props.mobile) {
    const mobile = props.mobile;

    // Convert padding
    if (mobile.px && mobile.py) {
      mobile.p = 'style:buttonPadding';
      delete mobile.px;
      delete mobile.py;
    } else if (mobile.px) {
      mobile.p = 'style:buttonPadding';
      delete mobile.px;
    }

    // Convert fontWeight
    if (mobile.fontWeight && mobile.fontWeight.match(/font-(bold|semibold)/)) {
      mobile.fontWeight = 'style:headingFont';
    }

    // Convert radius (except rounded-full)
    if (mobile.radius && mobile.radius !== 'rounded-full') {
      mobile.radius = 'style:borderRadius';
    }

    // Convert shadow
    if (mobile.shadow && mobile.shadow.startsWith('shadow')) {
      mobile.shadow = 'style:shadowStyle';
    }
  }

  return props;
}

// Process container/wrapper props
function processContainerProps(props) {
  if (!props) return props;

  // Process root
  if (props.root) {
    // Convert radius
    if (props.root.radius && props.root.radius !== 'rounded-full') {
      props.root.radius = 'style:borderRadius';
    }

    // Convert padding
    if (props.root.p && (props.root.p === 'p-8' || props.root.p === 'p-6')) {
      props.root.p = 'style:containerPadding';
    }

    // Convert px/py
    if (props.root.px && props.root.py) {
      const pxVal = parseInt(props.root.px.match(/\d+/)?.[0] || '0');
      const pyVal = parseInt(props.root.py.match(/\d+/)?.[0] || '0');
      if (pxVal >= 6 && pyVal >= 3) {
        props.root.p = 'style:containerPadding';
        delete props.root.px;
        delete props.root.py;
      }
    }
  }

  // Process mobile
  if (props.mobile) {
    const mobile = props.mobile;

    // Convert padding
    if (mobile.p && (mobile.p === 'p-8' || mobile.p === 'p-6')) {
      mobile.p = 'style:containerPadding';
    }
  }

  return props;
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Find all Element components with Button
    const buttonRegex = /<Element\s+is=\{Button\}[\s\S]*?\/>/g;
    const matches = content.match(buttonRegex);

    if (matches) {
      matches.forEach(match => {
        // Extract props
        const rootMatch = match.match(/root=\{(\{[\s\S]*?\})\}/);
        const mobileMatch = match.match(/mobile=\{(\{[\s\S]*?\})\}/);

        if (rootMatch || mobileMatch) {
          let newMatch = match;

          // Process root props
          if (rootMatch) {
            try {
              const rootProps = eval(`(${rootMatch[1]})`);
              const processed = processButtonProps({ root: rootProps });
              const newRoot = JSON.stringify(processed.root, null, 10)
                .replace(/"([^"]+)":/g, '$1:')
                .replace(/"/g, '"');
              newMatch = newMatch.replace(rootMatch[0], `root={${newRoot}}`);
            } catch (e) {
              // Skip if can't parse
            }
          }

          // Process mobile props
          if (mobileMatch) {
            try {
              const mobileProps = eval(`(${mobileMatch[1]})`);
              const processed = processButtonProps({ mobile: mobileProps });
              const newMobile = JSON.stringify(processed.mobile, null, 10)
                .replace(/"([^"]+)":/g, '$1:')
                .replace(/"/g, '"');
              newMatch = newMatch.replace(mobileMatch[0], `mobile={${newMobile}}`);
            } catch (e) {
              // Skip if can't parse
            }
          }

          content = content.replace(match, newMatch);
        }
      });
    }

    // Also look for root={{ ... }} patterns and update radius/padding
    content = content.replace(/radius:\s*"rounded-(lg|md)"/g, 'radius: "style:borderRadius"');
    content = content.replace(/px:\s*"px-(\d+)",\s*py:\s*"py-(\d+)"/g, (match, px, py) => {
      const pxNum = parseInt(px);
      const pyNum = parseInt(py);
      if (pxNum >= 6 && pyNum >= 3) {
        return 'p: "style:buttonPadding"';
      }
      return match;
    });

    // Add fontFamily to buttons that don't have it
    content = content.replace(
      /(<Element\s+is=\{Button\}[\s\S]*?root=\{)(\{[^}]*?)(\})/g,
      (match, prefix, props, suffix) => {
        if (!props.includes('fontFamily')) {
          // Add fontFamily after the opening brace
          return `${prefix}${props},\n          fontFamily: "style:headingFontFamily"${suffix}`;
        }
        return match;
      }
    );

    // Add shadow to buttons with non-transparent backgrounds
    content = content.replace(
      /(<Element\s+is=\{Button\}[\s\S]*?root=\{)(\{[^}]*?background:\s*"bg-(?!transparent)[^"]*"[^}]*?)(\})/g,
      (match, prefix, props, suffix) => {
        if (!props.includes('shadow')) {
          return `${prefix}${props},\n          shadow: "style:shadowStyle"${suffix}`;
        }
        return match;
      }
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Updated with design system`);
    } else {
      console.log(`  ℹ️  No changes needed`);
    }

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

// Main execution
function main() {
  const toolboxDir = path.join(__dirname, '..', 'components', 'editor', 'Viewport', 'Toolbox');

  console.log('🎨 Updating toolbox components with design system...\n');

  // Files to process
  const files = [
    'buttonComponents.tsx',
    'navComponents.tsx',
    'textComponents.tsx',
    'formComponents.tsx',
    'listComponents.tsx',
  ].map(file => path.join(toolboxDir, file));

  files.forEach(file => {
    if (fs.existsSync(file)) {
      processFile(file);
      console.log('');
    }
  });

  console.log('✨ Done!');
}

main();

const fs = require('fs');
const path = require('path');

// Get all section template files
const templatesDir = path.join(__dirname, '../data/section-templates');
const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));

console.log(`🔍 Found ${templateFiles.length} template files to process...`);

const updateFlexDirection = (node) => {
  if (!node || !node.props) return;

  // Check if this node has mobile flexDirection: "flex-row"
  if (node.props.mobile && node.props.mobile.flexDirection === "flex-row") {
    console.log(`📱 Found flex-row in mobile for: ${node.custom?.displayName || node.type?.resolvedName || 'Unknown'}`);

    // Move flex-row to desktop
    node.props.desktop = node.props.desktop || {};
    node.props.desktop.flexDirection = "flex-row";

    // Set mobile to flex-col
    node.props.mobile.flexDirection = "flex-col";

    console.log(`✅ Updated: mobile → flex-col, desktop → flex-row`);
  }

  // Recursively process children
  if (node.nodes && Array.isArray(node.nodes)) {
    node.nodes.forEach(childId => {
      // Find the child node in the structure
      const childNode = findNodeById(node, childId);
      if (childNode) {
        updateFlexDirection(childNode);
      }
    });
  }
};

const findNodeById = (rootNode, targetId) => {
  // This is a simplified search - in practice, we'd need to traverse the full structure
  // For now, we'll process the main structure object
  return null; // Placeholder - we'll handle this differently
};

const processTemplateFile = (filePath) => {
  try {
    console.log(`\n📄 Processing: ${path.basename(filePath)}`);

    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    let updatedCount = 0;

    // Process each template in the file
    if (json.templates && Array.isArray(json.templates)) {
      json.templates.forEach(template => {
        console.log(`\n  🎯 Template: ${template.name}`);

        // Process the structure recursively
        const processNode = (node) => {
          if (!node) return;

          // Check if this node has mobile flexDirection: "flex-row"
          if (node.props && node.props.mobile && node.props.mobile.flexDirection === "flex-row") {
            console.log(`    📱 Found flex-row in mobile for: ${node.custom?.displayName || node.type?.resolvedName || 'Unknown'}`);

            // Move flex-row to desktop
            node.props.desktop = node.props.desktop || {};
            node.props.desktop.flexDirection = "flex-row";

            // Set mobile to flex-col
            node.props.mobile.flexDirection = "flex-col";

            console.log(`    ✅ Updated: mobile → flex-col, desktop → flex-row`);
            updatedCount++;
          }

          // Process children recursively
          if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => processNode(child));
          }
        };

        // Process the template structure
        if (template.structure) {
          processNode(template.structure);
        }
      });
    }

    if (updatedCount > 0) {
      // Write the updated file
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
      console.log(`  ✅ Updated ${updatedCount} flex-direction properties in ${path.basename(filePath)}`);
    } else {
      console.log(`  ℹ️  No flex-direction updates needed in ${path.basename(filePath)}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
};

// Process all template files
templateFiles.forEach(file => {
  const filePath = path.join(templatesDir, file);
  processTemplateFile(filePath);
});

console.log(`\n🎉 Finished processing all section templates!`);

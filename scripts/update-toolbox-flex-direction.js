const fs = require('fs');
const path = require('path');

// Get all toolbox component files
const toolboxDir = path.join(__dirname, '../components/editor/Viewport/Toolbox');
const toolboxFiles = fs.readdirSync(toolboxDir).filter(file => file.endsWith('.tsx'));

console.log(`🔍 Found ${toolboxFiles.length} toolbox files to process...`);

const processToolboxFile = (filePath) => {
  try {
    console.log(`\n📄 Processing: ${path.basename(filePath)}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let updatedCount = 0;
    
    // Pattern to find mobile flexDirection: "flex-row" that should be moved to desktop
    const mobileFlexRowPattern = /mobile:\s*\{[^}]*?flexDirection:\s*"flex-row"[^}]*?\}/gs;
    
    // Find all matches
    const matches = content.match(mobileFlexRowPattern);
    
    if (matches) {
      matches.forEach(match => {
        console.log(`  📱 Found mobile flex-row in: ${match.substring(0, 50)}...`);
        
        // Extract the mobile object content
        const mobileMatch = match.match(/mobile:\s*\{([^}]*?flexDirection:\s*"flex-row"[^}]*?)\}/s);
        if (mobileMatch) {
          const mobileContent = mobileMatch[1];
          
          // Change flex-row to flex-col in mobile
          const updatedMobileContent = mobileContent.replace(
            /flexDirection:\s*"flex-row"/,
            'flexDirection: "flex-col"'
          );
          
          // Create the replacement
          const replacement = match.replace(mobileContent, updatedMobileContent);
          
          // Check if there's already a desktop object nearby
          const beforeMatch = content.substring(0, content.indexOf(match));
          const afterMatch = content.substring(content.indexOf(match) + match.length);
          
          // Look for desktop object in the next 200 characters
          const next200Chars = afterMatch.substring(0, 200);
          const desktopMatch = next200Chars.match(/desktop:\s*\{[^}]*?\}/s);
          
          if (desktopMatch) {
            // Desktop object exists, add flexDirection to it
            const desktopContent = desktopMatch[0];
            const updatedDesktopContent = desktopContent.replace(
              /\{([^}]*)\}/,
              (match, innerContent) => {
                // Add flexDirection if not already present
                if (!innerContent.includes('flexDirection')) {
                  return `{${innerContent.trim() ? innerContent + ', ' : ''}flexDirection: "flex-row"}`;
                } else {
                  // Replace existing flexDirection
                  return `{${innerContent.replace(/flexDirection:\s*"[^"]*"/, 'flexDirection: "flex-row"')}}`;
                }
              }
            );
            
            // Replace both mobile and desktop
            const fullReplacement = replacement + afterMatch.substring(0, desktopMatch.index) + updatedDesktopContent;
            content = beforeMatch + fullReplacement + afterMatch.substring(desktopMatch.index + desktopMatch[0].length);
          } else {
            // No desktop object, add one
            const desktopAddition = `,\n      desktop: {\n        flexDirection: "flex-row"\n      }`;
            const fullReplacement = replacement + desktopAddition;
            content = beforeMatch + fullReplacement + afterMatch;
          }
          
          updatedCount++;
          console.log(`    ✅ Updated: mobile → flex-col, desktop → flex-row`);
        }
      });
    }
    
    if (updatedCount > 0) {
      // Write the updated file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Updated ${updatedCount} flex-direction properties in ${path.basename(filePath)}`);
    } else {
      console.log(`  ℹ️  No flex-direction updates needed in ${path.basename(filePath)}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
};

// Process all toolbox files
toolboxFiles.forEach(file => {
  const filePath = path.join(toolboxDir, file);
  processToolboxFile(filePath);
});

console.log(`\n🎉 Finished processing all toolbox components!`);

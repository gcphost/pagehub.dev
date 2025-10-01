const fs = require('fs');
const path = require('path');

// This script generates a list of all Tailwind classes to safelist
// Based on the classes defined in utils/tailwind.ts

const outputPath = path.join(__dirname, '..', 'tailwind-safelist.js');

// Generate all possible classes
const classes = [];

// Spacing values
const spacingValues = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96'];
const spacingPrefixes = ['m', 'p'];
const spacingDirections = ['', 't', 'r', 'b', 'l', 'x', 'y'];

spacingPrefixes.forEach(prefix => {
  spacingDirections.forEach(dir => {
    spacingValues.forEach(val => {
      classes.push(`${prefix}${dir}-${val}`);
      if (prefix === 'm') {
        classes.push(`-${prefix}${dir}-${val}`); // negative margins
      }
    });
  });
});

// Gap
spacingValues.forEach(val => {
  classes.push(`gap-${val}`);
  classes.push(`gap-x-${val}`);
  classes.push(`gap-y-${val}`);
});

// Width & Height
const sizeValues = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96', 'auto', 'full', 'screen', 'min', 'max', 'fit'];
const fractions = ['1/2', '1/3', '2/3', '1/4', '2/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/6', '2/6', '3/6', '4/6', '5/6', '1/12', '2/12', '3/12', '4/12', '5/12', '6/12', '7/12', '8/12', '9/12', '10/12', '11/12'];

sizeValues.forEach(val => {
  classes.push(`w-${val}`);
  classes.push(`h-${val}`);
});
fractions.forEach(val => {
  classes.push(`w-${val}`);
  classes.push(`h-${val}`);
});

// Colors
const colors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'white', 'black'];
const colorShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const colorPrefixes = ['bg', 'text', 'border', 'from', 'to', 'via'];

colors.forEach(color => {
  colorShades.forEach(shade => {
    colorPrefixes.forEach(prefix => {
      classes.push(`${prefix}-${color}-${shade}`);
    });
  });
});

// Custom theme colors
const themeColors = ['primary', 'secondary', 'accent'];
themeColors.forEach(color => {
  colorShades.forEach(shade => {
    colorPrefixes.forEach(prefix => {
      classes.push(`${prefix}-${color}-${shade}`);
      classes.push(`${prefix}-${color}`);
    });
  });
});

// Responsive prefixes
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
const responsiveClasses = [...classes];
breakpoints.forEach(bp => {
  responsiveClasses.forEach(cls => {
    classes.push(`${bp}:${cls}`);
  });
});

// Hover states
const hoverClasses = [...classes];
hoverClasses.forEach(cls => {
  classes.push(`hover:${cls}`);
});

console.log(`Generated ${classes.length} classes`);

const content = `module.exports = ${JSON.stringify(classes, null, 2)};`;
fs.writeFileSync(outputPath, content);
console.log(`Safelist written to ${outputPath}`);


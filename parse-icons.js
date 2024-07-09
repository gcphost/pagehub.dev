const fs = require("fs");
const path = require("path");
const glob = require("glob");

const rootDir = "./public/icons/fa";
const outputFile = "./utils/icons.json";

// Find all SVG files in the root directory and its subdirectories
glob(`${rootDir}/**/*.svg`, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Create an object to store the folder names and their SVG files
  const folderObject = {};

  // Loop through the SVG files and add them to the object based on their directory
  files.forEach((file) => {
    const dirName = path.parse(file).dir.split(path.sep).pop();
    if (!folderObject[dirName]) {
      folderObject[dirName] = [];
    }
    folderObject[dirName].push(file.replace("./public", ""));
  });

  // Write the object to a JSON file
  const json = JSON.stringify(folderObject, null, 2);
  fs.writeFileSync(outputFile, json);
});

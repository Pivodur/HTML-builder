const path = require("path");
const fs = require("fs");

const stylesFolder = path.join(__dirname, "styles");
const distFolder = path.join(__dirname, "project-dist");


async function mergeCss() {
  try {
    const cssFiles =  await fs.promises.readdir(stylesFolder, { withFileTypes: true });
    const output = fs.createWriteStream(path.join(distFolder, "bundle.css"), "utf-8");
    for (const file of cssFiles) {
      const filePath = path.join(stylesFolder, file.name);
      if (!file.isDirectory() && path.extname(file.name) == ".css") {
        const input = fs.createReadStream(filePath, "utf-8");
        input.pipe(output);
      }
    }
    
  } catch (error) {
    console.log(error);
  }
}

mergeCss();
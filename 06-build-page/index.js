const fs = require("fs");
const path = require("path");

const projectDist = path.join(__dirname, "project-dist");
const assetsSrcFolder = path.join(__dirname, "assets");
const assetsDestFolder = path.join(projectDist, "assets");

async function mergeCss() {
  try {
    const stylesFolder = path.join(__dirname, "styles");
    const stylesFiles = await fs.promises.readdir(stylesFolder, {
      withFileTypes: true,
    });
    const destFile = fs.createWriteStream(path.join(projectDist, "styles.css"));
    for (const file of stylesFiles) {
      if (!file.isDirectory() && path.extname(file.name) == ".css") {
        const readFile = fs.createReadStream(
          path.join(stylesFolder, file.name),
          "utf-8"
        );
        readFile.pipe(destFile);
      }
    }
  } catch (error) {
    console.log("error in copy css");
  }
}

async function copyAssets(source, destination) {
  try {
    const sourceInner = await fs.promises.readdir(source, {
      withFileTypes: true,
    });
    for (const item of sourceInner) {
      if (!item.isDirectory()) {
        const srcFile = path.join(source, item.name);
        const destFile = path.join(destination, item.name);
        await fs.promises.copyFile(srcFile, destFile);
      } else {
        const newSrc = path.join(source, item.name);
        const newDest = path.join(destination, item.name);
        await fs.promises.mkdir(newDest, { recursive: true });
        copyAssets(newSrc, newDest);
      }
    }
  } catch (error) {
    console.log("error in copy assets", error);
  }
}

async function deleteAssets(source, destination) {
  try {
    const sourceInner = await fs.promises.readdir(source);
    console.log("sourceInner", sourceInner);
    const destInner = await fs.promises.readdir(destination);
    console.log("destInner", destInner);

    for (const item of destInner) {
      console.log(item);
      const itemPath = path.join(destination, item);
      const itemStat = await fs.promises.stat(itemPath);
      if (!sourceInner.includes(item)) {
        // console.log(itemPath);
        if (itemStat.isDirectory()) {
          await fs.promises.rmdir(itemPath, { recursive: true });
        } else {
          await fs.promises.unlink(itemPath);
        }
      } else if (itemStat.isDirectory()) {
        console.log("directory", item);
        const newSource = path.join(source, item);
        const newDest = path.join(destination, item);
        await deleteAssets(newSource, newDest);
      }

    }

  } catch (error) {
    console.log("delete assets error", error);
  }
}


async function buildHtml() {
  try {
  } catch (error) {
    console.log("error in html builder");
  }
}

async function buildPage() {
  try {
    await mergeCss();
  } catch (error) {
    console.log("error in build page:", error);
  }
}

fs.mkdir(projectDist, { recursive: true }, () => {
  deleteAssets(assetsSrcFolder, assetsDestFolder);
});

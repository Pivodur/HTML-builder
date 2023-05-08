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
    const destFile = fs.createWriteStream(path.join(projectDist, "style.css"));
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
    // Создаем index.html и stream
    const templatePath = path.join(__dirname, "template.html");
    const targetPath = path.join(projectDist, "index.html");
    const targetStream = fs.createWriteStream(targetPath);
    // await fs.promises.copyFile(templatePath, targetPath);

    // Создание потока чтения для index.html
    const templateReadStream = fs.createReadStream(templatePath, "utf-8");
    let templateText = "";

    templateReadStream.on("data", chunk => {
      templateText += chunk;
    });

    await new Promise(resolve => {
      templateReadStream.on("end", () => {
        resolve();
      });
    });

    // Считываем папку components
    const componentsPath = path.join(__dirname, "components");
    const components = await fs.promises.readdir(componentsPath);
    const componentsInfo = components.map(file => path.parse(file));

    // Запись шаблонов в index.html
    for (const item of componentsInfo) {
      const componentReadStream = fs.createReadStream(
        path.join(componentsPath, item.base),
        "utf-8"
      );
      let componentText = "";

      componentReadStream.on("data", chunk => {
        componentText += chunk;
      });

      await new Promise(resolve => {
        componentReadStream.on("end", () => {
          resolve();
        });
      });

      templateText = templateText.replace(`{{${item.name}}}`, componentText);
    }
    targetStream.write(templateText)


  } catch (error) {
    console.log("error in html builder", error);
  }
}



async function buildPage() {
  try {
    await fs.promises.mkdir(projectDist, { recursive: true });
    await mergeCss();
    await copyAssets(assetsSrcFolder, assetsDestFolder);
    await deleteAssets(assetsSrcFolder, assetsDestFolder);
    await buildHtml();
  } catch (error) {
    console.log("buildPage error", error);
  }
}

buildPage()
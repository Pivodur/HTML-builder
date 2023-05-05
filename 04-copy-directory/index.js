const path = require("path");
const fs = require("fs/promises");
const fileSrc = path.join(__dirname, "files");
const fileDest = path.join(__dirname, "filesCopy");

async function makeCopyDir() {
  try {
    await fs.mkdir(fileDest, { recursive:true });
    const files = await fs.readdir(fileSrc);
    const filesDest = await fs.readdir(fileDest);
    for (const file of files) {
      const srcPath = path.join(fileSrc, file)
      const destPath = path.join(fileDest, file)
      fs.copyFile(srcPath, destPath);
    }
    for (const file of filesDest) {
      if (!files.includes(file)) {
        const deletedFile = path.join(fileDest, file);
        await fs.unlink(deletedFile);
      }
    }
  } catch (error) {
    throw error(error)
  }
}

makeCopyDir()

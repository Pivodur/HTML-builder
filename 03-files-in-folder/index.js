// const path = require("path");
// const fs = require("fs");
// const secretFolder = path.join(__dirname, "secret-folder");
// const dirInfo = [];

// fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
//   if (err) throw err;
//   let count = 0;
//   for (file of files) {
//     if (!file.isDirectory()) {
//       const fileInfo = [];
//       fileInfo.push(file.name);
//       fileInfo.push(path.extname(file.name));
//       const filePath = path.join(secretFolder, file.name);
//       fs.stat(filePath, (err, stats) => {
//         if (err) throw err;
//         fileInfo.push(stats.size);
//         dirInfo.push(fileInfo.join(" - "));
//         count++;
//         if (count === files.length - 1) {
//           console.log(dirInfo.join("\n"));
//         }
//       });
//     }
//   }
// });

const fs = require("fs/promises");
const path = require("path");

async function readDir() {
  try {
    const secretFolder = path.join(__dirname, "secret-folder");
    const dirInfo = [];
    const files = await fs.readdir(secretFolder, { withFileTypes: true });
    for (const file of files) {
      if (!file.isDirectory()) {
        const fileInfo = [];
        fileInfo.push(file.name);
        fileInfo.push(path.extname(file.name));
        const filePath = path.join(secretFolder, file.name);
        const stats = await fs.stat(filePath);
        fileInfo.push(stats.size);
        dirInfo.push(fileInfo.join(" - "));
      }
    }
    console.log(dirInfo.join("\n"));
  } catch (err) {
    console.error(err);
  }
}

readDir();



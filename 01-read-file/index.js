const fs = require("fs");
const path = require("path");

const streamPath = path.join(__dirname, "text.txt");
const readableStream = fs.createReadStream(streamPath, "utf-8");

let data = '';

readableStream.on("data", (chunk) => data += chunk);
readableStream.on("end", () => console.log(data));
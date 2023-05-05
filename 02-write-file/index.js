const { stdin, stdout } = process;
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const filePath = path.join(__dirname, "text.txt");

stdout.write("Hello, you can input text now \n");
const output = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

rl.on("line", (input) => {
  if (input === "exit") {
    stdout.write("Goodbye!");
    process.exit();
  } else {
    fs.appendFile(filePath, input += "\n", (err) => {
      if (err) throw err;
    });
  }
});

rl.on("SIGINT", () => {
  stdout.write("Goodbye!"); 
  process.exit()
});

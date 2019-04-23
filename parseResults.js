const fs = require("fs");

const result = fs.readFileSync(`${__dirname}/cdkdeployresult.txt`, {
  encoding: "utf-8"
});

const lines = result.split("\n");
var line = 0;

for (line = 0; line < lines.length; line++) {
  if (lines[line] === "Outputs:") {
    line++;
    break;
  }
}

var outputs = {};

while (line < lines.length && lines[line] !== "") {
  try {
    var key = lines[line].split("=")[0].trim();
    key = key.split(".")[key.split(".").length - 1];
    outputs[key] = lines[line].split("=")[1].trim();
  } catch (e) {
    console.log(outputs, lines[line]);
    throw e;
  }
  line++;
}

const configtxt =
  "# This is an auto generated file. Any edits will be overwritten\nexport default " +
  JSON.stringify(outputs) +
  ";";

fs.writeFile("src/config.js", configtxt, function(err) {
  if (err) throw err;
  console.log("config file saved!");
});

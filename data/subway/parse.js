const fs = require("fs");
const content = fs.readFileSync("./data.txt", "utf8");

const data = content.split("\n").map((line) => {
  const items = line.split(/\s+/);
  let name = items[1];
  if (items[2] !== name) {
    name += `-` + items[2];
  }
  let value = items[3];
  return { label: name, value: parseInt(value) };
});

fs.writeFileSync("./data.json", JSON.stringify(data, undefined, 2));

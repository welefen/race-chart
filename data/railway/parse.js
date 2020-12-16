const fs = require("fs");
const content = fs.readFileSync("./data.txt", "utf8");

const data = content.split("\n").map((line) => {
  const items = line.split(/\s+/);
  let name = items[0];
  return { label: name, value: parseInt(items[1]) };
});

fs.writeFileSync("./data.json", JSON.stringify(data, undefined, 2));

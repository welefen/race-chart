const fs = require("fs");
const path = require("path");
const csv = path.join(__dirname, "./province.csv");
const result = path.join(__dirname, "./province.json");
const content = fs.readFileSync(csv, "utf8");
const lines = content.split("\n");
const data = {
  columnNames: [],
  data: [],
};

lines.forEach((line, index) => {
  const items = line.split(",");
  if (index) {
    data.columnNames.push(items[0]);
    items.slice(1).forEach((item, idx) => {
      data.data[idx].values.push(parseFloat(item));
    });
  } else {
    items.slice(1).forEach((item) => {
      data.data.push({
        label: item,
        values: [],
      });
    });
  }
});

data.columnNames = data.columnNames.reverse();
data.data = data.data.map(item => {
  item.values = item.values.reverse();
  return item;
})

fs.writeFileSync(result, JSON.stringify(data));

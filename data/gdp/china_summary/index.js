const fs = require("fs");
const path = require("path");
const csv = path.join(__dirname, "./china.csv");
const result = path.join(__dirname, './china.json');
const content = fs.readFileSync(csv, "utf8");
const lines = content.split("\n");
const data = {
  columnNames: [],
  data: [
    {
      label: "总 GDP",
      values: [],
    },
    {
      label: "第一产业",
      values: [],
    },
    {
      label: "第二产业",
      values: [],
    },
    {
      label: "第三产业",
      values: [],
    },
  ],
};

lines.slice(1).reverse().forEach(line => {
  const [year, gdp, _, first, second, third] = line.split(',');
  data.columnNames.push(year);
  data.data[0].values.push(parseInt(gdp));
  data.data[1].values.push(parseInt(first));
  data.data[2].values.push(parseInt(second));
  data.data[3].values.push(parseInt(third));
})


fs.writeFileSync(result, JSON.stringify(data));
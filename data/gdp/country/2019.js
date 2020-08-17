const fs = require("fs");
const path = require("path");
const content = fs.readFileSync(path.join(__dirname, "2019.txt"), "utf8");
const lines = content.split("\n");
const country = require('../../country.json');

function getCountryData(name) {
  let data;
  country.some(item => {
    if(item.en === name) {
      data = item;
      return true;
    }
  })
  return data;
}

const data = lines.map(line => {
  const items = line.split(/\s+/);
  const value = parseInt(items.pop().replace(/\,/g, ''));
  items.shift();
  const name = items.join(' ');
  const data = getCountryData(name);
  return {
    label: data.zh,
    image: data.image,
    value: value
  }
}).sort((a, b) => a.value < b.value ? 1 : -1).slice(0, 40);


const saveFile = path.join(__dirname, 'rank_en.json');
fs.writeFileSync(saveFile, JSON.stringify(data, undefined, 2))
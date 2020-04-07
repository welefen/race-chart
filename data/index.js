const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, './data.json');
const content = fs.readFileSync(filepath, 'utf8');
const data = JSON.parse(content);
data.data.forEach(item => {
  item.values = item.values.map(item => parseInt(item, 10));
})
fs.writeFileSync(filepath, JSON.stringify(data, undefined, 4));
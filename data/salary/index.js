const fs = require('fs');
const path = require('path');
const content = fs.readFileSync('./2020.txt', 'utf8');
const lines = content.split('\n');
const data = lines.map(line => {
  const [label, value] = line.split(/\s+/);
  return {label, value: parseInt(value)};
})
fs.writeFileSync('./2020.json', JSON.stringify(data, undefined, 2));
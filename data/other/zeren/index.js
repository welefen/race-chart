const fs = require('fs');
const path = require('path');
const content = fs.readFileSync('./data.txt', 'utf8');
const lines = content.split('\n');
const data = lines.map(line => {
  const [label, value] = line.split(/\s+/);
  return {label, value: parseFloat(value)};
})
fs.writeFileSync('./data.json', JSON.stringify(data, undefined, 2));
const fs = require('fs');
const path = require('path');
const { parse } = require('path');
const content = fs.readFileSync(path.join(__dirname, 'data.html'), 'utf8');

const nameReg = /<span[^<>]+class="name">(.*?)<\/span>/;
const valueReg = /<span[^<>]+class="value">(.*?)<\/span>/;


function parseData(reg, content) {
    const result = [];
    while(true) {
        const match = content.match(reg);
        if(!match) break;
        result.push(match[1]);
        content = content.slice(match.index + match[0].length);
    }
    return result;
}

const names = parseData(nameReg, content);
const values = parseData(valueReg, content).map(item => {
    return parseInt(item.replace(/,/g, '')) * 1000;
})

const data = names.map((name, index) => {
    return {label: name, value: values[index]}
})

fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, undefined, 2))
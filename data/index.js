const fs = require('fs');
const qcdn = require('@q/qcdn');
const path = require('path');
const filepath = path.join(__dirname, './data.json');
const newpath = path.join(__dirname, './country.json');
const content = fs.readFileSync(filepath, 'utf8');
const data = JSON.parse(content);
(async function () {
  // data.columnNames = [];
  const promises = data.data.map(item => {
    // item.values = [];
    if(item.image.indexOf('qhimg.com') > -1) return;
    item.values = item.values.map(item => parseInt(item, 10));
    return qcdn.url(item.image, 'png').then(url => {
      item.image = Object.values(url)[0];
    })
  })
  await Promise.all(promises)
  const content = JSON.stringify(data);
  // console.log(content)
  fs.writeFileSync(filepath, content);
})()
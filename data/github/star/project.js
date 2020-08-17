const data = require('./data.json');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data.json');
const content = fs.readFileSync(path.join(__dirname, 'project.txt'), 'utf8');
const lines = content.split('\n');
lines.forEach(project => {
  const flag = data.projects.some(item => {
    if(item.project === project) return true;
  })
  if(!flag) {
    data.projects.push({
      project,
      page: 0,
      data: {}
    })
  }
})
fs.writeFileSync(dataPath, JSON.stringify(data));
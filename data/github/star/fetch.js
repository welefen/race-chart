const axios = require("axios").default;
const data = require("./data.json");
const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "data.json");

const axiosGit = axios.create({
  headers: {
    Accept: "application/vnd.github.v3.star+json",
    Authorization: `token ${data.token}`,
  },
});

const index = 5;
data.projects.slice(0, index).forEach((item) => {
  getStarHistory(item).then((_) => {
    const itemData = data.projects[index++];
    if (itemData) {
      getStarHistory(itemData);
    } else {
      index = 1;
      getStarHistory(data.projects[0]);
    }
  });
});

async function getStarHistory(data) {
  const initUrl = `https://api.github.com/repos/${data.project}/stargazers`; // used to get star info
  while (true) {
    const url = `${initUrl}?page=${data.page + 1}`;
    console.log(data.project, data.page);
    const result = await axiosGit.get(url).catch(err => {
      console.error(err);
    });
    if (!result || result.data.length < 30) {
      break;
    }
    data.page++;
    result.data.forEach((item) => {
      const date = item.starred_at.slice(0, 7);
      if (!data.data[date]) {
        data.data[date] = 1;
      } else {
        data.data[date]++;
      }
    });
  }
}

setInterval(() => {
  fs.writeFileSync(dataPath, JSON.stringify(data));
}, 2000);

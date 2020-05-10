const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
const token = fs.readFileSync("../token.txt", "utf8");
const filepath = path.join(__dirname, 'data.json');

const per_page = 30;
const axiosGit = axios.create({
  headers: {
    Accept: "application/vnd.github.v3.star+json",
    Authorization: `token ${token}`,
  },
});

async function getUserProfile(url) {
  const result = await axiosGit
    .get(url, {
      timeout: 10 * 1000,
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
  if (!result || result instanceof Error) {
    return {};
  }
  const { data } = result;
  return {
    name: data.name || data.login,
    avatar_url: data.avatar_url,
    location: data.location || '',
    followers: data.followers,
    isChina: (data.location || '').toLowerCase().indexOf("china") > -1,
  };
}

async function getFollowersList() {
  const initUrl = `https://api.github.com/search/users?q=followers:%3E5000&sort=followers&order=desc&per_page=${per_page}`;
  let page = 1;
  const ret = [];
  while (true) {
    const url = `${initUrl}&page=${page}`;
    console.log(url)
    const result = await axiosGit
      .get(url, {
        timeout: 10 * 1000,
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    if (!result || result instanceof Error) {
      break;
    }
    const promises = result.data.items.map((item) => {
      return getUserProfile(item.url);
    });
    await Promise.all(promises).then((data) => {
      ret.push(...data);
    });
    console.log(result.data.items.length, page);
    if (result.data.items.length < per_page) {
      break;
    }
    page++;
  }
  fs.writeFileSync(filepath, JSON.stringify(ret, undefined, 2));
  // console.log(ret);
}

getFollowersList();

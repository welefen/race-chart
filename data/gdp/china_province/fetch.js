const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const $ = require("cheerio");
const filepath = path.join(__dirname, "province.csv");

function escape(content) {
  if (!content) {
    return "";
  }
  //&#x59B9;
  return content.replace(/&#x([\da-f]{4});?/gi, (a, b) => {
    return unescape(`%u${b}`);
  });
}

(async function () {
  const content = await fetch("http://gdp.gotohui.com/").then((res) =>
    res.text()
  );
  const list = $($(".aside .recommend table", content)[0]);
  const a = list.find("a");
  const province = [];
  a.each(function () {
    const name = escape($(this).html());
    const href = $(this).attr("href");
    province.push({ name, href });
  });
  for (const item of province) {
    const content = await fetch(
      `http://gdp.gotohui.com${item.href}`
    ).then((res) => res.text());
    const list = $(`.listcontent table.ntable tr`, content);
    const data = {};
    list.each(function (i) {
      if (!i) return;
      const td = $("td", this);
      const year = $("a", td[0]).html();
      const gdp = $(td[1]).html();
      data[year] = gdp;
    });
    item.data = data;
  }
  const years = [];
  for (let i = 1978; i <= 2019; i++) {
    years.push(i);
  }
  const html = [["年份"].concat(province.map((item) => item.name)).join(",")];
  years.reverse().forEach((year) => {
    const data = [year]
      .concat(province.map((item) => item.data[year] || 0))
      .join(",");
    html.push(data);
  });
  fs.writeFileSync(filepath, html.join("\n"));
})();

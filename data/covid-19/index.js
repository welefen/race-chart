const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// const filepath = path.join(__dirname, "data.json");
const conpath = path.join(__dirname, "con.json");
const deathpath = path.join(__dirname, "death.json");
const econpath = path.join(__dirname, "econ.json");

const d = new Date();
const today =
  `0${d.getMonth() + 1}`.slice(-2) + "." + `0${d.getDate()}`.slice(-2);

(async function () {
  const data = await fetch(
    "https://gwpre.sina.cn/interface/fymap2020_data.json"
  ).then((res) => res.json());
  const result = {
    columnNames: [],
    data: [],
  };
  const { historylist } = data.data;
  const itemData = {
    label: "中国", //国家名称
    columnNames: [], //日期
    contotal: [], // 确诊总数
    deathtotal: [], // 死亡总数
    econNum: [], //现存确诊
  };
  historylist.reverse().forEach((item) => {
    itemData.columnNames.push(item.date);
    itemData.contotal.push(parseInt(item.cn_conNum));
    itemData.deathtotal.push(parseInt(item.cn_deathNum));
    itemData.econNum.push(parseInt(item.cn_econNum));
  });
  if (!itemData.columnNames.includes(today)) {
    itemData.columnNames.push(today);
  }
  itemData.contotal.push(parseInt(data.data.gntotal));
  itemData.deathtotal.push(parseInt(data.data.deathtotal));
  itemData.econNum.push(parseInt(data.data.econNum));
  result.data.push(itemData);

  for (const item of data.data.worldlist) {
    const itemData = {
      label: item.name, //国家名称
      columnNames: [], //日期
      contotal: [], // 确诊总数
      deathtotal: [], // 死亡总数
      econNum: [], //现存确诊
    };
    if (!item.citycode) continue;
    const url = `https://gwpre.sina.cn/interface/news/wap/ncp_foreign.d.json?citycode=${item.citycode}`;
    const data = await fetch(url).then((res) => res.json());
    const { historylist } = data.data;
    historylist.reverse().forEach((item) => {
      itemData.columnNames.push(item.date);
      itemData.contotal.push(parseInt(item.conNum));
      itemData.deathtotal.push(parseInt(item.deathNum));
      itemData.econNum.push(parseInt(item.conNum) - parseInt(item.cureNum))
    });
    if (!itemData.columnNames.includes(today)) {
      itemData.columnNames.push(today);
    }
    itemData.contotal.push(parseInt(data.data.contotal));
    itemData.deathtotal.push(parseInt(data.data.deathtotal));
    itemData.econNum.push(parseInt(data.data.contotal) - parseInt(data.data.curetotal))
    result.data.push(itemData);
  }

  const columnNames = result.data[0].columnNames;
  const conData = {
    columnNames,
    data: [],
  };
  const deathData = {
    columnNames,
    data: [],
  };
  const econData = {
    columnNames,
    data: []
  }
  result.data.forEach((item) => {
    let prevIndex = -1;
    const contotal = [];
    const deathtotal = [];
    const econNum = [];
    columnNames.forEach((date) => {
      const index = item.columnNames.indexOf(date);
      if (index === -1) {
        if (prevIndex === -1) {
          contotal.push(0);
          deathtotal.push(0);
          econNum.push(0);
        } else {
          contotal.push(item.contotal[prevIndex]);
          deathtotal.push(item.deathtotal[prevIndex]);
          econNum.push(item.econNum[prevIndex]);
        }
      } else {
        contotal.push(item.contotal[index]);
        deathtotal.push(item.deathtotal[index]);
        econNum.push(item.econNum[index]);
        prevIndex = index;
      }
    });
    conData.data.push({
      label: item.label,
      values: contotal,
    });
    deathData.data.push({
      label: item.label,
      values: deathtotal,
    });
    econData.data.push({
      label:item.label,
      values: econNum
    })
    fs.writeFileSync(conpath, JSON.stringify(conData));
    fs.writeFileSync(deathpath, JSON.stringify(deathData));
    fs.writeFileSync(econpath, JSON.stringify(econData));
  });
})();

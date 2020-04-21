const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const countries = require("../country.json");

function getCountryEnName(zh) {
  let en = "";
  countries.some((item) => {
    if (item.zh === zh) {
      en = item.en;
      return true;
    }
  });
  return en;
}

function getCountryImage(zh) {
  let image = "";
  countries.some((item) => {
    if (item.zh === zh) {
      image = item.image;
      return true;
    }
  });
  return image;
}

const conCNPath = path.join(__dirname, "con_cn.json");
const deathCNPath = path.join(__dirname, "death_cn.json");
const econCNPath = path.join(__dirname, "econ_cn.json");

const conENPath = path.join(__dirname, "con_en.json");
const deathENPath = path.join(__dirname, "death_en.json");
const econENPath = path.join(__dirname, "econ_en.json");

const d = new Date();
// const today = `0${d.getMonth() + 1}`.slice(-2) + "." + `0${d.getDate()}`.slice(-2);
const today = '04.20';

;(async function () {
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
    image: getCountryImage("中国"),
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
      image: getCountryImage(item.name),
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
      itemData.econNum.push(parseInt(item.conNum) - parseInt(item.cureNum));
    });
    if (!itemData.columnNames.includes(today)) {
      itemData.columnNames.push(today);
    }
    itemData.contotal.push(parseInt(data.data.contotal));
    itemData.deathtotal.push(parseInt(data.data.deathtotal));
    itemData.econNum.push(
      parseInt(data.data.contotal) - parseInt(data.data.curetotal)
    );
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
    data: [],
  };
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
      image: getCountryImage(item.label),
      values: contotal,
    });
    deathData.data.push({
      label: item.label,
      image: getCountryImage(item.label),
      values: deathtotal,
    });
    econData.data.push({
      label: item.label,
      image: getCountryImage(item.label),
      values: econNum,
    });
  });
  fs.writeFileSync(conCNPath, JSON.stringify(conData));
  fs.writeFileSync(deathCNPath, JSON.stringify(deathData));
  fs.writeFileSync(econCNPath, JSON.stringify(econData));
  conData.data.forEach((item) => {
    item.label = getCountryEnName(item.label);
  });
  deathData.data.forEach((item) => {
    item.label = getCountryEnName(item.label);
  });
  econData.data.forEach((item) => {
    item.label = getCountryEnName(item.label);
  });
  fs.writeFileSync(conENPath, JSON.stringify(conData));
  fs.writeFileSync(deathENPath, JSON.stringify(deathData));
  fs.writeFileSync(econENPath, JSON.stringify(econData));
})();

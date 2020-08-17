const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const filepath = path.join(__dirname, "charts_download.json");
const pkgImgs = require("../pkg.json");

const urlPrefix = "https://api.npmjs.org/downloads/range/";
// const packages = 'express,koa,@hapi/hapi,fastify,@nestjs/core,sails,loopback,restify,egg,thinkjs'.split(',');
// const packages = 'lodash,chalk,request,commander,react,express,debug,async,fs-extra,moment,prop-types,react-dom,bluebird,underscore,vue,axios,tslib,mkdirp,glob,yargs,colors,webpack,inquirer,uuid,classnames,minimist,body-parser,rxjs,babel-runtime,jquery,yeoman-generator,through2,babel-core,core-js,semver,babel-loader,cheerio,rimraf,q,eslint,css-loader,shelljs,dotenv,typescript,@types/node,@angular/core,js-yaml,style-loader'.split(',');
// const packages = "react,vue,jquery,angular,backbone,zepto,ember-cli,element-ui,antd,bootstrap".split(",");
const packages = "d3,echarts,highcharts,chart.js,@amcharts/amcharts4,chartist,@antv/g2,fusioncharts,ember-charts,spritejs,three,mapbox,mapbox-gl,cytoscape,babylonjs,cesium,pixi.js".split(",");
// const packages = 'webpack,rollup,gulp,grunt,parcel,fis'.split(',');

(async function () {
  const promises = packages.map(async (package) => {
    let year = 2015;
    const endYear = new Date().getFullYear();
    const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
    const endStr = `${endYear}-${month}`;
    const result = {};
    while (year <= endYear) {
      const url = `${urlPrefix}${year}-01-01:${year + 1}-01-01/${package}`;
      const data = await fetch(url).then((res) => res.json());
      console.log("url", url);
      data.downloads.forEach((item) => {
        if (!item.downloads) return;
        if (year.toString() !== item.day.slice(0, 4)) return;
        const key = item.day.slice(0, 7);
        if (key === endStr) return;
        if (!result[key]) {
          result[key] = 0;
        }
        result[key] += item.downloads;
      });
      year++;
    }
    return { label: package, data: result };
  });
  const list = await Promise.all(promises);
  const set = new Set();
  list.forEach((item) => {
    const keys = Object.keys(item.data);
    keys.forEach((key) => {
      set.add(key);
    });
  });
  const columns = Array.from(set);
  columns.sort();

  const result = {
    columnNames: columns,
    data: [],
  };
  result.data = list.map((item) => {
    const ret = {
      label: item.label,
      image: pkgImgs[item.label] || "",
      values: [],
    };
    result.columnNames.forEach((column) => {
      ret.values.push(item.data[column] || 0);
    });
    return ret;
  });
  result.columnNames = result.columnNames.map((item) => item.replace("-", "."));
  fs.writeFileSync(filepath, JSON.stringify(result, undefined, 2));
})();

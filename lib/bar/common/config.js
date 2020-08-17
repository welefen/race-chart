"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../common/config");
const util_1 = require("../../common/util");
const label = {
    fontSize: 18,
    fontFamily: config_1.fontFamily,
    color: 'currentColor',
    width: 100
};
const logo = {
    disabled: false,
    deltaSize: 0,
    borderSize: 6
};
const rect = {
    minWidth: 0,
    width: 0,
    color: 'red',
    radius: 3,
    type: '2d',
    angle: 45,
    sideHeight: 10,
};
const value = {
    value: 0,
    fontSize: 14,
    fontFamily: config_1.fontFamily,
    color: 'currentColor',
    width: 100
};
const desc = {
    fontSize: 14,
    fontFamily: config_1.fontFamily,
    color: '#333'
};
exports.barConfig = {
    label,
    logo,
    rect,
    value,
    desc,
    alignSpacing: 5,
    justifySpacing: 5,
};
exports.barChartConfig = {
    ...config_1.chartConfig,
    axis: config_1.axisConfig,
    showNum: 10,
    scaleType: 'dynamic',
    sortType: 'desc',
    formatter: util_1.valueFormatter,
    duration: 1000
};

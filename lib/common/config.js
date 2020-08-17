"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../common/util");
exports.fontFamily = '"宋体"';
const colors = ["#67b7dc", "#6794dc", "#6771dc", "#8067dc", "#a367dc", "#c767dc", "#dc67ce", "#dc67ab", "#dc6788", "#dc6967", "#dc8c67", "#dcaf67", "#dcd267", "#c3dc67", "#a0dc67", "#7ddc67", "#67dc75", "#67dc98", "#67dcbb", "#67dadc"];
colors.sort(_ => Math.random() > 0.5 ? 1 : -1);
exports.watermark = {
    fontSize: 16,
    fontFamily: exports.fontFamily,
    color: '#ccc',
    rotate: -45,
};
exports.title = {
    fontSize: 30,
    fontFamily: exports.fontFamily,
    color: '#444',
    align: 'center',
    lineHeight: 40,
};
const subTitle = {
    fontSize: 20,
    fontFamily: exports.fontFamily,
    color: '#444',
    align: 'center',
    lineHeight: 30,
};
exports.chartConfig = {
    width: 960,
    height: 540,
    displayRatio: 2,
    padding: [0, 0, 0, 0],
    watermark: exports.watermark,
    title: exports.title,
    subTitle,
    background: {},
    openingImage: {
        time: 2000
    },
    endingImage: {
        time: 2000
    },
    colors,
    lastStayTime: 2000
};
exports.axisConfig = {
    maxTick: 4,
    label: {
        color: '#666',
        fontSize: 12,
        fontFamily: exports.fontFamily,
        pos: 'top',
        width: 100,
        height: 40,
        lineHeight: 40,
        formatter: util_1.valueFormatter
    },
    line: {
        color: '#eee',
        width: 0.5,
    }
};

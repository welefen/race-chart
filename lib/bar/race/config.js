"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../common/config");
const config_2 = require("../../common/config");
const total = {
    disabled: false,
    prefix: 'Total: ',
    fontSize: 22,
    fontFamily: config_2.fontFamily,
    color: '#aaa',
    align: 'right',
};
const column = {
    text: '',
    fontSize: 80,
    color: '#bbb',
    fontFamily: config_2.fontFamily,
    fontWeight: 'bold',
    align: 'right'
};
const bar = {
    ...config_1.barConfig,
    total,
    column
};
exports.barRaceConfig = {
    ...config_1.barChartConfig,
    bar
};

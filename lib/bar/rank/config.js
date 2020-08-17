"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../common/config");
const config_2 = require("../../common/config");
const rank = {
    fontFamily: config_2.fontFamily,
    fontSize: 60,
    color: '#aaa',
    formatter(index) {
        return `第${index}名`;
    }
};
exports.barRankConfig = {
    ...config_1.barChartConfig,
    delay: 300,
    bar: {
        ...config_1.barConfig,
        rank
    }
};

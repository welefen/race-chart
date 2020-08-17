"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../common/config");
const util_1 = require("../../common/util");
exports.lineRaceConfig = {
    ...config_1.chartConfig,
    scoreType: 'score',
    line: {
        justifySpacing: 5,
        line: {
            width: 4,
            shadeWidth: 12,
            shadeOpacity: 0.2
        },
        circle: {
            radius: 20
        },
        label: {
            fontSize: 12,
            fontFamily: config_1.fontFamily,
            fontWeight: 'bold',
            width: 100,
        },
        value: {
            fontSize: 12,
            fontFamily: config_1.fontFamily,
            pos: 'inside',
            formatter: util_1.valueFormatter
        }
    },
    yAxis: config_1.axisConfig,
    xAxis: util_1.deepmerge(config_1.axisConfig, {
        label: {
            pos: 'top'
        }
    }),
};

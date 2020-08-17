"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../common/config");
exports.cloudConfig = {
    ...config_1.chartConfig,
    mask: {
        fontFamily: config_1.fontFamily,
        fontSize: 300,
        fontWeight: 'bold',
        color: '#000'
    },
    gridSize: 8,
    minSize: 10,
    maxSize: 300,
    textStyle: {},
    debug: {
        drawGridItems: false,
        drawMaskImage: false,
        drawPoints: false
    },
    delay: 100,
    autoShrink: true,
    shrinkPercent: 0.9,
    shufflePoints: true,
    rotate: {
        disabled: false,
        min: -90,
        max: 90,
        step: 90
    }
};

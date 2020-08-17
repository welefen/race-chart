"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamic_1 = require("../../common/axis/dynamic");
const chart_1 = require("../../common/chart");
class BarChart extends chart_1.Chart {
    constructor() {
        super(...arguments);
        this.index = 0;
    }
    renderAxis(x, y, width, height) {
        const { label, justifySpacing, value } = this.config.bar;
        this.axis = new dynamic_1.DynamicAxis({
            type: 'column',
            x: x + label.width + justifySpacing,
            y,
            width: width - label.width - justifySpacing * 2 - value.width,
            height,
            ...this.config.axis,
        });
        this.axis.appendTo(this.layer);
    }
}
exports.BarChart = BarChart;

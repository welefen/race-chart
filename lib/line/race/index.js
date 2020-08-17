"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chart_1 = require("../../common/chart");
const dynamic_1 = require("../../common/axis/dynamic");
const fixed_1 = require("../../common/axis/fixed");
const config_1 = require("./config");
const util_1 = require("../../common/util");
const lineGroup_1 = require("./lineGroup");
const util_2 = require("./util");
class LineRace extends chart_1.Chart {
    constructor() {
        super(...arguments);
        this.index = 0;
    }
    setConfig(config) {
        config = util_1.deepmerge({}, config_1.lineRaceConfig, this.config || {}, config);
        if (config.scoreType === 'rank') {
            util_2.parseDataByRank(config.data);
        }
        super.setConfig(config);
        this.initMaxValues();
    }
    initMaxValues() {
        const { columnNames, data } = this.config.data;
        if (this.config.scoreType === 'score') {
            let values = columnNames.map((_, idx) => {
                const values = data.map(item => item.values[idx]);
                return Math.max(...values) / 0.9;
            });
            this.maxValues = values;
        }
        else {
            const { data, columnNames } = this.config.data;
            this.maxValues = [...new Array(columnNames.length)].fill(data.length);
        }
    }
    renderYAxis(x, y, width, height) {
        if (this.config.scoreType === 'score') {
            this.yAxis = new dynamic_1.DynamicAxis({
                type: 'row',
                x,
                y,
                width,
                height,
                ...this.config.yAxis,
            });
            this.yAxis.appendTo(this.layer);
        }
        else {
            const length = this.config.data.data.length;
            this.yAxis = new fixed_1.FixedAxis({
                type: 'row',
                x, y,
                width,
                height,
                ...this.config.yAxis,
                maxTick: length - 1,
            });
            const columns = [...new Array(length)].map((_, index) => (index + 1).toString());
            this.yAxis.appendTo(this.layer);
            this.yAxis.initTicks(columns);
        }
    }
    renderXAxis(x, y, width, height) {
        this.xAxis = new fixed_1.FixedAxis({
            type: 'column',
            x,
            y,
            width,
            height,
            ...this.config.xAxis,
        });
        this.xAxis.appendTo(this.layer);
    }
    async render() {
        await super.render();
        let [y, paddingRight, paddingBottom, x] = this.config.padding;
        let width = this.config.width - x - paddingRight;
        let height = this.config.height - y - paddingBottom;
        const titleHeight = await this.renderTitle({
            ...this.config.title,
            x, y, width, height
        });
        y += titleHeight;
        height -= titleHeight;
        const subTitleHeight = await this.renderTitle({
            ...this.config.subTitle,
            x, y, width, height
        });
        y += subTitleHeight;
        height -= subTitleHeight;
        const yAxisLabelWidth = this.config.yAxis.label.width;
        const xAxisLabelHeight = this.config.xAxis.label.height;
        let yAxisY = y;
        if (this.config.xAxis.label.pos === 'top') {
            yAxisY = y + xAxisLabelHeight;
        }
        const labelWidth = this.config.line.label.width;
        this.renderYAxis(x, yAxisY, width - labelWidth, height - xAxisLabelHeight);
        this.renderXAxis(x + yAxisLabelWidth, y, width - yAxisLabelWidth - labelWidth, height);
        this.xAxis.initTicks(this.config.data.columnNames);
        const lineGroup = new lineGroup_1.LineGroup({
            ...this.config,
            x: x + yAxisLabelWidth,
            y: yAxisY,
            width: width - yAxisLabelWidth - labelWidth,
            height: height - xAxisLabelHeight
        });
        lineGroup.appendTo(this.layer);
        this.lineGroup = lineGroup;
    }
    async start() {
        await this.render();
        const length = this.config.data.columnNames.length;
        let { duration } = this.config;
        while (this.index < length) {
            this.emit('change', this.index);
            await this.beforeAnimate();
            const dur = typeof duration === 'function' ? duration(this.index, length) : duration;
            await this.timer.start(dur);
            await this.afterAnimate();
            this.index++;
        }
        await this.renderLastStayTime();
        await this.renderEndingImage();
        this.emit('end');
    }
    beforeAnimate() {
        const maxValue = this.maxValues[this.index];
        if (this.config.scoreType === 'score') {
            this.yAxis.beforeAnimate({ maxValue, index: this.index });
        }
        this.xAxis.beforeAnimate({ index: this.index });
    }
    onUpdate(percent) {
        const oldMaxValue = this.maxValues[Math.max(0, this.index - 1)];
        const maxValue = this.maxValues[this.index];
        if (this.config.scoreType === 'score') {
            this.yAxis.onUpdate({ oldMaxValue, maxValue, percent, index: this.index });
        }
        this.lineGroup.onUpdate({ index: this.index, percent, oldMaxValue, maxValue });
        this.xAxis.onUpdate({ index: this.index, percent });
    }
    afterAnimate() {
        if (this.config.scoreType === 'score') {
            this.yAxis.afterAnimate({ index: this.index });
        }
        this.lineGroup.afterAnimate();
        this.xAxis.afterAnimate({ index: this.index });
    }
}
exports.LineRace = LineRace;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const barChart_1 = require("../common/barChart");
const util_1 = require("../../common/util");
const config_1 = require("./config");
const barGroup_1 = require("./barGroup");
class BarRank extends barChart_1.BarChart {
    setConfig(config) {
        config = util_1.deepmerge({}, config_1.barRankConfig, this.config || {}, config || {});
        super.setConfig(config);
        this.config.data.sort((a, b) => {
            return a.value > b.value ? 1 : -1;
        });
        // 可能数据长度不足 showNum 的大小
        this.config.showNum = Math.min(this.config.showNum, this.config.data.length);
        this.initMaxValues();
    }
    initMaxValues() {
        let values = this.config.data.map(item => item.value);
        this.maxValues = values;
    }
    renderBars(pos) {
        this.barGroup = new barGroup_1.BarGroup({
            ...this.config,
            ...pos
        });
        return this.barGroup.appendTo(this.layer);
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
        this.renderAxis(x, y, width, height);
        const axisHeight = this.config.axis.label.height;
        await this.renderBars({ x, y: y + axisHeight, width, height: height - axisHeight });
    }
    async start() {
        await this.render();
        const length = this.config.data.length;
        let { duration } = this.config;
        while (this.index < length) {
            this.emit('change', this.index);
            await this.beforeAnimate();
            const dur = typeof duration === 'function' ? duration(this.index, length) : duration;
            await this.timer.start(dur);
            await this.afterAnimate();
            this.index++;
            await util_1.timeout(this.config.delay);
        }
        await this.renderLastStayTime();
        await this.renderEndingImage();
        this.emit('end');
    }
    onUpdate(percent) {
        this.barGroup.onUpdate(this, percent);
        const oldMaxValue = this.index ? this.maxValues[this.index - 1] : 0;
        const maxValue = this.maxValues[this.index];
        this.axis.onUpdate({ oldMaxValue, maxValue, percent });
    }
    beforeAnimate() {
        this.barGroup.beforeAnimate(this);
        const maxValue = this.maxValues[this.index];
        this.axis.beforeAnimate({ maxValue });
    }
    afterAnimate() {
        this.barGroup.afterAnimate(this);
        this.axis.afterAnimate({});
    }
}
exports.BarRank = BarRank;

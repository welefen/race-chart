"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const barChart_1 = require("../common/barChart");
const util_1 = require("../../common/util");
const util_2 = require("./util");
const config_1 = require("./config");
const barGroup_1 = require("./barGroup");
class BarRace extends barChart_1.BarChart {
    constructor() {
        super(...arguments);
        this.status = 'run';
        this.values = []; //当前 index 所在的 values
    }
    setConfig(config) {
        config = util_1.deepmerge({}, config_1.barRaceConfig, this.config || {}, config);
        super.setConfig(config);
        this.config.data = util_2.parseData(this.config.data, this.config.showNum);
        // 按第一个数据从大到小排序
        util_2.sortValues(this.config.data.data, 0, this.config.sortType);
        // 可能数据长度不足 showNum 的大小
        this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
        this.initMaxValues();
    }
    initMaxValues() {
        const { columnNames, data } = this.config.data;
        let values = columnNames.map((_, idx) => {
            const values = data.map(item => item.values[idx]);
            return Math.max(...values);
        });
        if (this.config.scaleType === 'fixed') {
            const max = Math.max(...values);
            values = [...new Array(columnNames.length)].fill(max);
        }
        this.maxValues = values;
    }
    async preload() {
        await super.preload();
        const { logo } = this.config.bar;
        if (!logo.disabled) {
            const promises = this.config.data.data.map(item => {
                if (!item.image)
                    return;
                return this.scene.preload({ id: item.image, src: item.image });
            });
            return Promise.all(promises).then(() => { });
        }
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
        this.beforeAnimate();
        this.afterAnimate();
    }
    renderBars(pos) {
        this.barGroup = new barGroup_1.BarGroup({
            ...this.config,
            ...pos
        });
        return this.barGroup.appendTo(this.layer);
    }
    async start() {
        await this.render();
        const length = this.config.data.columnNames.length;
        let { duration } = this.config;
        while (this.index < length) {
            if (this.status === 'stop') {
                this.emit('stop');
                return;
            }
            ;
            const column = this.config.data.columnNames[this.index];
            this.emit('change', column);
            this.beforeAnimate();
            const dur = typeof duration === 'function' ? duration(column, this.index, length) : duration;
            await this.timer.start(dur);
            this.afterAnimate();
            this.index++;
        }
        await this.renderLastStayTime();
        await this.renderEndingImage();
        this.emit('end');
    }
    beforeAnimate() {
        util_2.sortValues(this.config.data.data, this.index, this.config.sortType);
        this.values = this.config.data.data.map(item => item.values[this.index]);
        this.barGroup.beforeAnimate(this);
        const maxValue = this.maxValues[this.index];
        this.axis.beforeAnimate({ maxValue });
    }
    afterAnimate() {
        this.barGroup.afterAnimate(this);
        this.axis.afterAnimate({});
    }
    onUpdate(percent) {
        this.barGroup.update(this, percent);
        const oldMaxValue = this.index ? this.maxValues[this.index - 1] : 0;
        const maxValue = this.maxValues[this.index];
        this.axis.onUpdate({ oldMaxValue, maxValue, percent });
    }
    stop() {
        this.status = 'stop';
        this.timer.stop();
    }
    restart() {
        this.status = 'run';
        return this.start();
    }
}
exports.BarRace = BarRace;

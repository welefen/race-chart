"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class DynamicAxis extends base_1.BaseAxis {
    constructor() {
        super(...arguments);
        this.maxValue = 0;
        this.step = 0;
    }
    getFormatValue(value) {
        const str = value.toString();
        if (str.length <= 3)
            return value;
        return parseInt(str.substr(0, 3)) * Math.pow(10, str.length - 3);
    }
    getSteps(value) {
        const item = Math.floor(value / this.config.maxTick).toString();
        let itemValue = item.length === 1 ? parseInt(item, 10) : parseInt(item.substr(0, 1), 10) * Math.pow(10, item.length - 1);
        itemValue = Math.max(1, itemValue);
        return [...new Array(this.config.maxTick)].map((_, index) => (index + 1) * itemValue);
    }
    // 更新 tick 的 位置
    updateTicksPos(percent) {
        const isRow = this.config.type === 'row';
        const size = isRow ? this.config.height : this.config.width;
        const prop = isRow ? 'y' : 'x';
        this.ticks.forEach(tick => {
            let val = tick.value / this.maxValue * size;
            if (isRow) {
                val = this.config.height - val;
            }
            tick.group.attr({ [prop]: val });
            if (tick.remove) {
                tick.group.attr({ opacity: Math.max(0, 1 - percent * 3) });
            }
            else if (tick.value < this.maxValue) {
                tick.group.attr({ opacity: 1 });
            }
        });
    }
    addTicks(ticks) {
        super.addTicks(ticks);
        this.ticks.forEach(tick => {
            if (tick.value > this.maxValue) {
                tick.group.attr({ opacity: 0 });
            }
        });
        this.ticks.sort((a, b) => {
            return a.value > b.value ? 1 : -1;
        });
        this.updateTicksPos(1);
    }
    beforeAnimate(data) {
        const { maxValue } = data;
        if (!this.maxValue) {
            this.maxValue = maxValue;
            const steps = this.getSteps(maxValue);
            this.step = steps[0];
            const ticks = [0].concat(steps).map(item => {
                return { value: item, label: this.config.label.formatter(item, 'axis') };
            });
            return this.addTicks(ticks);
        }
        const max = this.ticks[this.ticks.length - 1].value;
        if (max + this.step < maxValue) {
            let num = 0;
            let maxValue = 0;
            const newSteps = this.getSteps(maxValue);
            if (max < newSteps[0]) {
                this.ticks.forEach((tick, index) => {
                    if (!index)
                        return;
                    tick.remove = true;
                });
                this.step = newSteps[0];
                this.addTicks(newSteps.map(item => {
                    return { value: item, label: this.config.label.formatter(item, 'axis') };
                }));
            }
            else {
                this.ticks.forEach((tick, index) => {
                    if (index % 2 === 1) {
                        tick.remove = true;
                        num++;
                    }
                    else {
                        maxValue = tick.value;
                    }
                });
                this.step *= 2;
                if (num) {
                    const values = [];
                    while (num) {
                        values.push(this.getFormatValue(maxValue + this.step));
                        num--;
                        maxValue += this.step;
                    }
                    this.addTicks(values.map(item => {
                        return { value: item, label: this.config.label.formatter(item, 'axis') };
                    }));
                }
            }
        }
    }
    onUpdate(data) {
        const { oldMaxValue, maxValue, percent } = data;
        if (oldMaxValue === maxValue)
            return;
        const v = Math.floor(oldMaxValue + (maxValue - oldMaxValue) * percent);
        if (!v)
            return;
        this.maxValue = v;
        this.updateTicksPos(percent);
    }
    afterAnimate(data) {
        this.ticks = this.ticks.filter(tick => {
            if (!tick.remove)
                return true;
            this.group.removeChild(tick.group);
        });
    }
}
exports.DynamicAxis = DynamicAxis;

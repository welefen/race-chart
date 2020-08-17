"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class FixedAxis extends base_1.BaseAxis {
    initTicks(columns) {
        this.columns = columns;
        const { width, height, maxTick, type } = this.config;
        this.itemWidth = (type === 'column' ? width : height) / maxTick;
        this.maxTick = maxTick;
        const arr = [...new Array(maxTick + 1)].map((_, index) => {
            return { value: index, label: columns[index] };
        });
        this.addTicks(arr);
        const prop = type === 'column' ? 'x' : 'y';
        this.ticks.forEach((tick, index) => {
            tick.group.attr({
                [prop]: this.itemWidth * index
            });
        });
    }
    beforeAnimate(data) {
    }
    onUpdate(data) {
        const { index, percent } = data;
        if (index <= this.maxTick)
            return;
        const first = this.ticks[0];
        first.group.children[0].attr({
            opacity: 1 - percent
        });
        this.ticks.forEach((tick, idx) => {
            if (!idx)
                return;
            tick.group.attr({
                x: this.itemWidth * idx - percent * this.itemWidth
            });
        });
    }
    afterAnimate(data) {
        const { index } = data;
        if (index <= this.maxTick)
            return;
        this.group.removeChild(this.ticks[0].group);
        this.ticks = this.ticks.slice(1);
        this.addTicks([{
                value: index,
                label: this.columns[index],
            }]);
        this.ticks.forEach((tick, idx) => {
            tick.group.attr({
                x: this.itemWidth * idx
            });
        });
    }
}
exports.FixedAxis = FixedAxis;

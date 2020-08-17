"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spritejs_1 = require("spritejs");
const util_1 = require("../util");
class BaseAxis {
    constructor(config) {
        this.ticks = [];
        this.config = config;
        this.group = util_1.createGroup(config);
    }
    appendTo(layer) {
        layer.appendChild(this.group);
    }
    generateColumnTick(str) {
        const group = new spritejs_1.Group({
            width: this.config.line.width,
            height: this.config.height
        });
        const { pos, height } = this.config.label;
        const props = pos === 'top' ? [height, this.config.height, 0] : [0, this.config.height - height, this.config.height - height];
        const label = util_1.createLabel(str, this.config.label);
        group.appendChild(label);
        label.textImageReady.then(() => {
            const [width] = label.clientSize;
            label.attr({
                height: this.config.label.height,
                x: -Math.floor(width / 2),
                y: props[2]
            });
        });
        const line = new spritejs_1.Polyline({
            points: [0, props[0], 0, props[1]],
            strokeColor: this.config.line.color,
            lineWidth: this.config.line.width
        });
        group.appendChild(line);
        return group;
    }
    generateRowTick(str) {
        const group = new spritejs_1.Group({
            width: this.config.width,
            height: this.config.line.width,
        });
        const label = util_1.createLabel(str, this.config.label);
        label.attr({
            width: this.config.label.width,
            textAlign: 'right',
            paddingRight: 5,
        });
        group.appendChild(label);
        label.textImageReady.then(() => {
            const [_, height] = label.clientSize;
            label.attr({
                y: -height / 2 - 1
            });
        });
        const line = new spritejs_1.Polyline({
            points: [this.config.label.width, 0, this.config.width, 0],
            strokeColor: this.config.line.color,
            lineWidth: this.config.line.width
        });
        group.appendChild(line);
        return group;
    }
    generateTick(str) {
        if (this.config.type === 'column') {
            return this.generateColumnTick(str);
        }
        return this.generateRowTick(str);
    }
    addTicks(ticks) {
        if (ticks.length === 0)
            return;
        ticks.forEach(item => {
            const flag = this.ticks.some(tick => tick.label === item.label && !tick.remove);
            if (flag)
                return;
            const group = this.generateTick(item.label);
            this.group.appendChild(group);
            this.ticks.push({ label: item.label, value: item.value, group });
        });
    }
    beforeAnimate(data) {
    }
    onUpdate(data) {
    }
    afterAnimate(data) {
    }
}
exports.BaseAxis = BaseAxis;

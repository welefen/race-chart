"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../common/util");
const barNode_1 = require("../common/barNode");
const deepmerge_1 = __importDefault(require("deepmerge"));
class BarGroup {
    constructor(config) {
        this.animateData = [];
        this.bars = [];
        this.config = config;
        this.group = util_1.createGroup(this.config);
        const { width, height, showNum } = this.config;
        const { label, value, justifySpacing, alignSpacing } = this.config.bar;
        this.rectMaxWidth = width - label.width - value.width - 2 * justifySpacing;
        this.barHeight = (height - alignSpacing * (showNum - 1)) / showNum;
    }
    async createBar(barRank) {
        const { data, colors } = barRank.config;
        const item = data[barRank.index];
        const color = colors[barRank.index % colors.length];
        const config = deepmerge_1.default(this.config.bar, {
            width: this.config.width,
            height: this.barHeight,
            label: {
                text: this.config.bar.rank.formatter(data.length - barRank.index)
            },
            color,
            value: {
                value: item.value,
                formatter: this.config.formatter
            },
            logo: {
                image: item.image
            },
            desc: {
                text: item.label
            }
        });
        const bar = new barNode_1.BarNode(config, 0, [item.value]);
        await bar.appendTo(this.group);
        bar.valueText = item.value;
        return bar;
    }
    async beforeAnimate(barRank) {
        const bar = await this.createBar(barRank);
        this.bars.push(bar);
        const { data, showNum, colors } = barRank.config;
        const currentData = data[barRank.index];
        const maxValue = barRank.maxValues[barRank.index];
        const lastData = barRank.index === data.length - 1;
        const length = this.bars.length;
        this.animateData = this.bars.map((bar, index) => {
            const last = index === length - 1;
            let newPos = 0;
            if (length >= showNum && !lastData) {
                newPos = this.getBarY(showNum - index);
            }
            else {
                newPos = this.getBarY(showNum - index - 1);
            }
            return {
                maxValue,
                width: bar.rectWidth,
                newWidth: bar.values[0] * this.rectMaxWidth / maxValue,
                pos: last ? 0 : bar.attr().y,
                newPos,
                opacity: !lastData && !index && length === showNum ? 0 : 1
            };
        });
    }
    onUpdate(barRank, percent) {
        if (percent < 0.5) {
            this.bars.forEach((bar, index) => {
                const { width, newWidth } = this.animateData[index];
                bar.rectWidth = width + (newWidth - width) * percent * 2;
            });
            return;
        }
        this.bars.forEach((bar, index) => {
            const item = this.animateData[index];
            bar.attr({
                y: item.pos + (item.newPos - item.pos) * (percent - 0.5) * 2,
                opacity: 1 + (item.opacity - 1) * (percent - 0.5) * 2
            });
        });
    }
    afterAnimate(barRank) {
        const { showNum, data } = barRank.config;
        const last = barRank.index === data.length - 1;
        if (this.bars.length >= showNum && !last) {
            const bar = this.bars.shift();
            bar.removeBy(this.group);
        }
    }
    async appendTo(layer) {
        layer.appendChild(this.group);
    }
    getBarY(index) {
        return (this.barHeight + this.config.bar.alignSpacing) * Math.min(index, this.config.showNum - 1);
    }
}
exports.BarGroup = BarGroup;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spritejs_1 = require("spritejs");
const util_1 = require("../../common/util");
const util_2 = require("../../common/util");
class BarNode {
    constructor(config, index, values) {
        this.polylines = [];
        this.values = [];
        this.index = 0;
        this.config = util_1.deepmerge({}, config);
        this.group = util_2.createGroup(this.config);
        this.index = index;
        this.values = values;
    }
    attr(attrs) {
        if (!attrs)
            return this.group.attributes;
        this.group.attr(attrs);
    }
    async appendTo(node) {
        node.appendChild(this.group);
        this.initLabel();
        this.initRect();
        await this.initLogo();
        await this.initValue();
        await this.initDesc();
    }
    removeBy(node) {
        node.removeChild(this.group);
    }
    initLabel() {
        const { width, text } = this.config.label;
        if (this.config.label.color === 'currentColor') {
            this.config.label.color = this.config.color;
        }
        this.label = util_2.createLabel(text || '', this.config.label);
        this.label.attr({
            width,
            fillColor: this.config.label.color,
            textAlign: 'right',
            lineHeight: this.config.height
        });
        this.group.appendChild(this.label);
    }
    initRect() {
        const rectConfig = this.config.rect;
        if (rectConfig.type === '3d') {
            const { sideHeight, angle } = rectConfig;
            const sinAngle = Math.sin(angle / 180 * Math.PI);
            const cosAngle = Math.cos(angle / 180 * Math.PI);
            const left = this.config.label.width + this.config.justifySpacing - sideHeight * cosAngle;
            this.rect = new spritejs_1.Group({
                width: rectConfig.width,
                height: this.config.height,
                bgcolor: this.config.color,
                opacity: .95,
                x: left
            });
            this.group.appendChild(this.rect);
            const strokeColor = 'rgba(255, 255, 255, 0.3)';
            const topp = new spritejs_1.Parallel({
                sides: [rectConfig.width, sideHeight],
                x: left + sideHeight * sinAngle,
                y: -sideHeight * cosAngle,
                angle: angle + 90,
                lineWidth: 0.5,
                strokeColor,
                fillColor: this.config.color,
            });
            this.polylines.push(topp);
            this.group.appendChild(topp);
            const rightp = new spritejs_1.Parallel({
                sides: [this.config.height, sideHeight],
                x: left + sideHeight * sinAngle,
                y: -sideHeight * cosAngle,
                angle,
                rotate: 90,
                lineWidth: 0.5,
                strokeColor,
                fillColor: this.config.color,
            });
            this.polylines.push(rightp);
            this.group.appendChild(rightp);
        }
        else {
            this.rect = new spritejs_1.Group({
                height: this.config.height,
                bgcolor: this.config.color,
                borderTopRightRadius: [rectConfig.radius, rectConfig.radius],
                borderBottomRightRadius: [rectConfig.radius, rectConfig.radius],
                x: this.config.label.width + this.config.justifySpacing
            });
            this.group.appendChild(this.rect);
        }
        this.rectWidth = rectConfig.width;
    }
    set rectWidth(width) {
        const rectConfig = this.config.rect;
        if (rectConfig.minWidth) {
            width = Math.max(width, rectConfig.minWidth);
        }
        this.config.rect.width = width;
        this.rect.attr({ width });
        if (this.polylines.length) {
            const { sideHeight, angle } = rectConfig;
            this.polylines[0].attr({ sides: [width, sideHeight] });
            const delta = sideHeight * (Math.sin(angle / 180 * Math.PI) - Math.cos(angle / 180 * Math.PI));
            this.polylines[1].attr({
                opacity: width ? 1 : 0,
                x: this.config.rect.width + this.config.label.width + this.config.justifySpacing + delta
            });
        }
        this.updateValueX();
        this.updateLogoX();
        this.updateDescX();
    }
    get rectWidth() {
        return this.config.rect.width || 0;
    }
    initValue() {
        if (this.config.value.color === 'currentColor') {
            this.config.value.color = this.config.color;
        }
        this.value = util_2.createLabel('', this.config.value);
        this.value.attr({
            width: this.config.value.width,
            lineHeight: this.config.height
        });
        this.group.appendChild(this.value);
        this.updateValueX();
    }
    initLogo() {
        if (!this.logoEnabled)
            return;
        const { logo } = this.config;
        const sprite = new spritejs_1.Sprite({
            texture: logo.image,
            height: this.config.height + logo.deltaSize,
            width: this.config.height + logo.deltaSize,
            border: [logo.borderSize, this.config.color],
            y: -(logo.borderSize + logo.deltaSize / 2),
            borderRadius: this.config.height,
            bgcolor: this.config.color
        });
        this.logo = sprite;
        this.group.appendChild(sprite);
        this.updateLogoX();
    }
    get logoEnabled() {
        const { logo } = this.config;
        if (!logo.image || logo.disabled)
            return false;
        return true;
    }
    initDesc() {
        const { desc } = this.config;
        if (!desc.text)
            return;
        this.desc = util_2.createLabel(desc.text, desc);
        this.desc.attr({
            fillColor: desc.color,
            textAlign: 'right',
            x: this.config.label.width + this.config.justifySpacing,
            lineHeight: this.config.height
        });
        this.group.appendChild(this.desc);
    }
    updateDescX() {
        if (!this.desc)
            return;
        this.desc.attr({
            width: this.config.rect.width - (this.logoSize / 2 || this.config.justifySpacing)
        });
    }
    set valueText(value) {
        this.config.value.value = value;
        const text = this.config.value.formatter(value, 'column');
        this.value.attr({ text });
    }
    updateValueX() {
        if (!this.value)
            return;
        const logoSize = this.logoSize;
        const delta = this.config.rect.width > logoSize / 2 ? this.logoSize / 2 : 0;
        this.value.attr({
            x: this.config.label.width + this.config.rect.width + this.config.justifySpacing * 2 + delta
        });
    }
    get logoSize() {
        if (!this.logoEnabled)
            return 0;
        const { logo } = this.config;
        return this.config.height + logo.deltaSize + logo.borderSize * 2;
    }
    updateLogoX() {
        if (!this.logo)
            return;
        const logoSize = this.logoSize;
        this.logo.attr({
            opacity: this.config.rect.width > logoSize / 2 ? 1 : 0,
            x: this.config.label.width + this.config.justifySpacing + this.config.rect.width - this.logoSize / 2
        });
    }
}
exports.BarNode = BarNode;

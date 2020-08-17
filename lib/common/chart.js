"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spritejs_1 = require("spritejs");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const util_1 = require("./util");
const timer_1 = require("./timer");
const watermark_1 = require("./watermark");
class Chart extends eventemitter3_1.default {
    constructor(config) {
        super();
        this.setConfig(config);
        this.scene = new spritejs_1.Scene({
            container: this.config.selector,
            width: this.config.width,
            height: this.config.height,
            displayRatio: this.config.displayRatio,
            autoResize: false
        });
        this.layer = this.scene.layer('layer', {
            handleEvent: false
        });
    }
    setConfig(config) {
        this.config = config;
        const { selector, duration } = this.config;
        this.timer = new timer_1.Timer(duration, this.onUpdate.bind(this));
        if (typeof selector === 'string') {
            this.config.selector = document.querySelector(selector);
        }
    }
    async preload() {
        const { openingImage, background, endingImage } = this.config;
        const list = [{
                id: 'openingImage',
                src: openingImage.image
            }, {
                id: 'backgroundImage',
                src: background.image
            }, {
                id: 'endingImage',
                src: endingImage.image
            }];
        for (const item of list) {
            if (item.src) {
                await this.scene.preload(item);
            }
        }
    }
    renderWatermark() {
        const { width, height } = this.config;
        const watermark = new watermark_1.Watermark({
            width, height,
            ...this.config.watermark
        });
        return watermark.appendTo(this.layer);
    }
    // 渲染背景
    renderBackground() {
        const { image, color, opacity } = this.config.background;
        const { width, height } = this.config;
        if (color) {
            const rect = new spritejs_1.Rect({
                fillColor: color,
                width, height
            });
            this.layer.appendChild(rect);
        }
        if (image) {
            const sprite = new spritejs_1.Sprite({
                texture: 'backgroundImage',
                width, height,
                opacity
            });
            this.layer.appendChild(sprite);
        }
    }
    /**
     * 渲染片头图片
     */
    async renderOpeningImage() {
        const { image, time } = this.config.openingImage;
        if (!image)
            return;
        const sprite = new spritejs_1.Sprite({
            texture: 'openingImage',
            width: this.config.width,
            height: this.config.height
        });
        this.layer.appendChild(sprite);
        await sprite.textureImageReady;
        await this.timer.start(time, _ => {
            sprite.attr({ opacity: Math.random() > 0.5 ? 0.98 : 1 });
        });
        this.layer.removeChild(sprite);
    }
    /**
     * 标题
     * @param config
     */
    async renderTitle(config) {
        if (!config.text)
            return 0;
        const label = util_1.createLabel(config.text, config);
        const { x, y, width } = config;
        label.attr({ x, y, width });
        this.layer.appendChild(label);
        await label.textImageReady;
        return label.clientSize[1];
    }
    /**
     * 片尾
     */
    async renderEndingImage() {
        const { image, time } = this.config.endingImage;
        if (!image)
            return;
        this.layer.removeAllChildren();
        const sprite = new spritejs_1.Sprite({
            texture: 'endingImage',
            width: this.config.width,
            height: this.config.height
        });
        this.layer.appendChild(sprite);
        await sprite.textureImageReady;
        return this.timer.start(time, _ => {
            sprite.attr({ opacity: Math.random() > 0.5 ? 0.99 : 1 });
        });
    }
    async render() {
        await this.preload();
        this.layer.removeAllChildren();
        await this.renderBackground();
        await this.renderWatermark();
        this.emit('start');
        await this.renderOpeningImage();
        this.emit('startRace');
    }
    /**
     * 最后停留时间
     */
    async renderLastStayTime() {
        const { lastStayTime } = this.config;
        if (lastStayTime) {
            const el = this.layer.children[0];
            await this.timer.start(lastStayTime, _ => {
                el.attr({ opacity: Math.random() > 0.5 ? 0.99 : 1 });
            });
        }
    }
    onUpdate(percent) {
    }
}
exports.Chart = Chart;

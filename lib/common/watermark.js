"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spritejs_1 = require("spritejs");
const util_1 = require("./util");
// 水印
class Watermark {
    constructor(config) {
        this.config = config;
    }
    async appendTo(layer) {
        const { image, text } = this.config;
        if (!image && !text)
            return;
        this.group = util_1.createGroup(this.config);
        layer.appendChild(this.group);
        let item = await this.create(this.group);
        const rect = item.getBoundingClientRect();
        const x = Math.abs(rect.x);
        const y = Math.abs(rect.y);
        const hNum = Math.floor((this.config.width - x) / rect.width / 3);
        const hDelta = (this.config.width - x - hNum * rect.width * 3) / hNum / 2;
        const vNum = Math.floor((this.config.height - y) / rect.height / 3);
        const vDelta = (this.config.height - y - vNum * rect.height * 3) / vNum / 2;
        for (let i = 0; i < hNum; i++) {
            for (let j = 0; j < vNum; j++) {
                if (i !== 0 || j !== 0) {
                    item = item.cloneNode(true);
                    this.group.appendChild(item);
                }
                item.attr({
                    x: x + rect.width * 3 * i + rect.width + hDelta * (i * 2 + 1),
                    y: y + rect.height * 3 * j + rect.height + vDelta * (j * 2 + 1)
                });
            }
        }
    }
    async create(group) {
        const { text, image, rotate, opacity } = this.config;
        if (image) {
            const sprite = new spritejs_1.Sprite({
                texture: image,
                rotate,
                opacity,
                anchor: [0.5, 0.5]
            });
            group.appendChild(sprite);
            return sprite.textureImageReady.then(_ => sprite);
        }
        const label = util_1.createLabel(text, this.config);
        label.attr({ rotate, opacity, anchor: [0.5, 0.5] });
        group.appendChild(label);
        return label.textImageReady.then(_ => label);
    }
}
exports.Watermark = Watermark;

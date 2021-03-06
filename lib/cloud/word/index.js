"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_1 = require("../common/cloud");
const util_1 = require("../../common/util");
class WordCloud extends cloud_1.Cloud {
    async putWord(word) {
        if (typeof word.deg !== 'number') {
            word.deg = this.getRotateDeg();
        }
        const info = await this.getTextInfo(word).catch(() => false);
        if (!info)
            return false;
        let r = this.maxRadius + 1;
        while (r--) {
            let points = this.getPointsAtRadius(r, this.center);
            if (this.config.shufflePoints) {
                points = [].concat(points);
                points.sort(() => Math.random() > 0.5 ? 1 : -1);
            }
            const drawn = points.some(point => {
                return this.tryToPutAtPoint(point, info);
            });
            if (drawn)
                return true;
        }
        if (this.config.autoShrink) {
            word.preFontSize = word.fontSize;
            word.fontSize *= this.config.shrinkPercent;
            word.shrinks = (word.shrinks || 0) + 1;
            return this.putWord(word);
        }
        return false;
    }
    async getTextInfo(word) {
        const { gridSize, minSize, maxSize, textStyle } = this.config;
        word.fontSize = Math.min(maxSize, Math.max(minSize, word.fontSize));
        if (word.shrinks && word.fontSize === word.preFontSize && word.fontSize === minSize) {
            return Promise.reject(new Error('fontSize can not shrink'));
        }
        const styles = { ...textStyle, fontSize: word.fontSize, rotate: word.deg };
        const label = util_1.createLabel(word.text, styles);
        this.layer.appendChild(label);
        label.attr({ fillColor: word.color, anchor: [0.5, 0.5], padding: [gridSize, gridSize, gridSize, gridSize] });
        await label.textImageReady;
        const deg = word.deg * Math.PI / 180;
        const cos = Math.cos(deg);
        const sin = Math.sin(deg);
        const { image } = label.textImage;
        if (!image.width || !image.height) {
            return Promise.reject(new Error('text image empty'));
        }
        const borderSize = label.borderSize;
        const hw = borderSize[0] / 2;
        const hh = borderSize[1] / 2;
        label.attr({
            x: Math.sqrt((hw * cos) ** 2 + (hh * sin) ** 2) + gridSize,
            y: Math.sqrt((hw * sin) ** 2 + (hh * cos) ** 2) + gridSize,
        });
        this.layer.removeChild(label);
        const dpr = this.config.displayRatio;
        let { width, height } = label.getBoundingClientRect();
        const gridWidth = Math.ceil(width / gridSize);
        const gridHeight = Math.ceil(height / gridSize);
        width = gridWidth * gridSize;
        height = gridHeight * gridSize;
        const cc = document.createElement('canvas');
        cc.width = width * dpr;
        cc.height = height * dpr;
        cc.style.width = `${width}px`;
        cc.style.height = `${height}px`;
        const ctx = cc.getContext('2d');
        const m = label.renderMatrix;
        ctx.scale(dpr, dpr);
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        const w = image.width / dpr;
        const h = image.height / dpr;
        const anchor = label.attributes.anchor;
        const x = -anchor[0] * w;
        const y = -anchor[1] * h;
        ctx.drawImage(image, x, y, w, h);
        // document.body.appendChild(cc);
        const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr);
        const occupied = this.getImageOccupied(imageData, gridSize * dpr);
        return {
            canvas: cc,
            gridWidth,
            gridHeight,
            width,
            height,
            occupied
        };
    }
    async start() {
        await this.render();
        const colorLength = this.config.colors.length;
        const length = this.config.data.length;
        let i = 0;
        let prevWord;
        while (i < length) {
            const { text, value } = this.config.data[i];
            const word = { text, fontSize: value, color: this.config.colors[i % colorLength] };
            if (prevWord) {
                word.fontSize = prevWord.fontSize * Math.max(1, text.length / prevWord.text.length);
            }
            await this.putWord(word);
            await util_1.timeout(this.config.delay);
            prevWord = word;
            i++;
        }
        await this.renderLastStayTime();
        await this.renderEndingImage();
        this.emit('end');
    }
}
exports.WordCloud = WordCloud;

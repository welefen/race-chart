import { Cloud } from '../common/cloud';
import { createLabel } from '../../common/util';
import { CloudItemInfo } from '../common/types';

export class WordCloud extends Cloud {
  private async putWord(str: string, weight: number, color: string) {
    const deg = this.getRotateDeg();
    const info = await this.getTextInfo(str, weight, deg, color).catch(() => false);
    if (!info) return false;
    let r = this.maxRadius + 1;
    while (r--) {
      const points = this.getPointsAtRadius(r, this.center);
      points.sort(() => Math.random() > 0.5 ? 1 : -1);
      const drawn = points.some(point => {
        return this.tryToPutAtPoint(point, <CloudItemInfo>info);
      })
      if (drawn) return true;
    }
    if (this.config.autoShrink) {
      return this.putWord(str, weight * this.config.shrinkPercent, color);
    }
  }
  private async getTextInfo(str: string, weight: number, deg: number, color: string): Promise<CloudItemInfo> {
    const { gridSize, weightFactor, minFontSize, maxFontSize, textStyle } = this.config;
    const fontSize = Math.min(maxFontSize, Math.max(minFontSize, weight * weightFactor));
    const styles = { ...textStyle, fontSize, rotate: deg };
    const label = createLabel(str, styles);
    this.layer.appendChild(label);
    label.attr({ fillColor: color, anchor: [0.5, 0.5], padding: [gridSize, gridSize, gridSize, gridSize] });
    await label.textImageReady;
    const cos = Math.cos(deg * Math.PI / 180);
    const sin = Math.sin(deg * Math.PI / 180);
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


    const dpr = this.config.displayRatio
    let { width, height } = label.getBoundingClientRect();
    const gridWidth = Math.ceil(width / gridSize);
    const gridHeight = Math.ceil(height / gridSize);
    width = gridWidth * gridSize;
    height = gridHeight * gridSize;

    const cc = document.createElement('canvas')
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
    if (!w || !h) {
      console.log(image, str, weight, deg, color);
    }
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
      occupied,
      fontSize
    }
  }
  async start() {
    await this.render();
    let i = 100;
    const length = this.config.colors.length;
    while (i--) {
      await this.putWord('中' + i, i + 1, this.config.colors[i % length]);
      await this.putWord('China' + i, i + 1, this.config.colors[i % length]);
      await this.putWord('test' + i, i + 1, this.config.colors[i % length]);
      await new Promise(resolve => {
        setTimeout(resolve, 30)
      })
    }
  }
}
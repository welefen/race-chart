import { Cloud } from '../common/cloud';
import { createLabel } from '../../common/util';
import { CloudItemInfo } from '../common/types';
import { Position } from '../../common/types';

export class WordCloud extends Cloud {
  private async putWord(str: string, weight?: number, deg: number = 0) {
    deg = deg || this.getRotateDeg();
    const info = await this.getTextInfo(str, weight, 45);
    let r = this.maxRadius + 1;
    while (r--) {
      const points = this.getPointsAtRadius(r, this.center);
      const drawn = points.some(point => {
        return this.tryToPutAtPoint(point, info);
      })
      if (drawn) {
        break;
      }
    }
  }
  private async getTextInfo(str: string, weight: number, deg: number): Promise<CloudItemInfo> {
    const { gridSize, weightFactor, minFontSize, textStyle } = this.config;
    let fontSize = weight * weightFactor;
    fontSize = Math.max(minFontSize, fontSize);
    const styles = { ...textStyle, fontSize, rotate: deg };
    const label = createLabel(str, styles);
    this.layer.appendChild(label);
    label.attr({ fillColor: 'red', anchor: [0.5, 0.5], padding: [gridSize, gridSize, gridSize, gridSize] });
    await label.textImageReady;
    const cos = Math.cos(deg * Math.PI / 180);
    const sin = Math.sin(deg * Math.PI / 180);
    const { image } = label.textImage;
    const borderSize = label.borderSize;
    const hw = borderSize[0] / 2;
    const hh = borderSize[1] / 2;
    label.attr({
      x: Math.sqrt((hw * cos) ** 2 + (hh * sin) ** 2) + gridSize,
      y: Math.sqrt((hw * sin) ** 2 + (hh * cos) ** 2) + gridSize,
    });


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
    ctx.drawImage(image, x, y, w, h);
    // document.body.appendChild(cc);

    const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr);
    const occupied = this.getImageOccupied(imageData);
    return {
      node: label,
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
    await this.putWord('中国人啊', 40);
    // await this.putWord('test', 50);
    // await this.putWord('China', 80);
  }
}
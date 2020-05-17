import { Cloud } from '../common/cloud';
import { createLabel } from '../../common/util';
import { CloudItemInfo } from '../common/types';
import { Position } from '../../common/types';

export class WordCloud extends Cloud {
  private async putWord(str: string, weight?: number, deg: number = 0) {
    deg = deg || this.getRotateDeg();
    const info = await this.getTextInfo(str, weight, 90);
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
    label.attr({ fillColor: 'red', opacity: 0 });
    await label.textImageReady;
    const { image } = label.textImage;
    let { width, height } = label.getBoundingClientRect();
    const gridWidth = Math.ceil(width / gridSize);
    const gridHeight = Math.ceil(height / gridSize);
    width = gridWidth * gridSize;
    height = gridHeight * gridSize;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const dpr = this.config.displayRatio;
    ctx.scale(dpr, dpr);
    const m = label.renderMatrix;
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    const w = image.width / dpr;
    const h = image.height / dpr;
    const anchor = label.attributes.anchor;
    const x = -anchor[0] * w;
    const y = -anchor[1] * h;
    ctx.drawImage(image, x, y, w, h);
    document.body.appendChild(canvas);
    const imageData = ctx.getImageData(0, 0, width, height);
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
import { Cloud } from '../common/cloud';
import { createLabel } from '../../common/util';
import { CloudItemInfo } from '../common/types';
import { Position } from '../../common/types';

export class WordCloud extends Cloud {
  private async putWord(str: string, weight) {
    const info = await this.getTextInfo(str, weight, 0);
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
    const ctx = image.getContext('2d');
    let imageData: ImageData;
    const { displayRatio } = this.config;
    if (displayRatio !== 1) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
      imageData = ctx.getImageData(0, 0, width, height);
    } else {
      imageData = ctx.getImageData(0, 0, width, height);
    }
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
    await this.putWord('中国', 160);
    await this.putWord('test', 150);
  }
}
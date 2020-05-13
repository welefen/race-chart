import { Chart } from '../../common/chart';
import { deepmerge } from '../../common/util';
import { cloudConfig } from './config';
import { CloudConfig } from './types';
import { Position } from '../../common/types';

export class Cloud extends Chart {
  config: CloudConfig;
  setConfig(config: CloudConfig) {
    config = deepmerge({}, cloudConfig, this.config || {}, config || {});
    super.setConfig(config);
  }
  private async renderImageMask(pos: Position): Promise<ImageData> {
    const { image } = this.config.mask;
    const imgs = await this.scene.preload({ src: image });
    return this.getMaskData(imgs[0], pos);
  }
  private getMaskData(img: HTMLImageElement, pos: Position): ImageData {
    const { width, height } = img;
    const widthRatio = width / pos.width;
    const heightRatio = height / pos.height;
    const ratio = Math.max(widthRatio, heightRatio);
    const newWidth = Math.floor(width / ratio);
    const newHeight = Math.floor(height / ratio);
    pos.x += Math.floor((pos.width - newWidth) / 2);
    pos.y += Math.floor((pos.height - newHeight) / 2);
    pos.width = newWidth;
    pos.height = newHeight;
    let canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height, 0, 0, newWidth, newHeight);
    const imageData: ImageData = ctx.getImageData(0, 0, newWidth, newHeight);
    const data = imageData.data;
    let toneSum = 0;
    let toneCnt = 0;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha > 128) {
        const tone = data[i] + data[i + 1] + data[i + 2];
        toneSum += tone;
        ++toneCnt;
      }
    }
    const threshold = toneSum / toneCnt;
    for (let i = 0; i < data.length; i += 4) {
      const tone = data[i] + data[i + 1] + data[i + 2];
      const alpha = data[i + 3];
      if (alpha < 128 || tone > threshold) {
        data[i + 3] = 0;
      } else {
        data[i + 3] = 255;
      }
    }
    canvas = null;
    return imageData;
  }
  // private renderTextMask(pos: Position): ImageData {

  // }
  // private renderEmptyMask(pos: Position): ImageData {

  // }
  protected renderMask(pos: Position): Promise<ImageData> {
    const { image, text } = this.config.mask;
    if (image) {
      return this.renderImageMask(pos);
    }
    if (text) {
      // return this.renderTextMask(pos);
    }
    // return this.renderEmptyMask(pos);
  }
}
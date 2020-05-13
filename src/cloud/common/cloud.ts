import { Chart } from '../../common/chart';
import { deepmerge } from '../../common/util';
import { cloudConfig } from './config';
import { CloudConfig } from './types';
import { Position } from '../../common/types';

export class Cloud extends Chart {
  protected grid: boolean[][] = [];
  protected pointsAtRadius: number[][] = [];
  public config: CloudConfig;
  public setConfig(config: CloudConfig) {
    config = deepmerge({}, cloudConfig, this.config || {}, config || {});
    config.gridSize = Math.max(4, config.gridSize);
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
        data[i + 3] = 0; // 不能填充的地方透明度设置为 0
      } else {
        data[i + 3] = 255;
      }
    }
    canvas = null;
    return imageData;
  }
  protected renderMask(pos: Position): Promise<ImageData> {
    const { image, text } = this.config.mask;
    if (image) {
      return this.renderImageMask(pos);
    }
  }
  private getGridStatus(imageData: ImageData, row: number, column: number, gridSize: number, wsize: number, flag: boolean = false) {
    let index = 0;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        index = (row * gridSize * wsize * gridSize + i * gridSize * wsize + column * gridSize + j) * 4 + 3;
        if (!flag) {
          if (!imageData.data[index]) return false;
        } else {
          if (imageData.data[index]) return true;
        }
      }
    }
    return flag ? false : true;
  }
  protected parseGridData(imageData: ImageData, flag?: boolean): boolean[][] {
    const { width, height } = imageData;
    const { gridSize } = this.config;
    const wsize = Math.ceil(width / gridSize);
    const hsize = Math.ceil(height / gridSize);
    const grid = [];
    console.log(wsize, hsize, imageData)
    for (let row = 0; row < hsize; row++) {
      grid[row] = [];
      for (let column = 0; column < wsize; column++) {
        grid[row][column] = this.getGridStatus(imageData, row, column, gridSize, wsize, flag);
      }
    }
    return grid;
  }
  protected getPointsAtRadius(radius: number, center: [number, number]) {
    if (this.pointsAtRadius[radius]) return this.pointsAtRadius[radius];
    
  }
  protected getRotateDeg() {
    return Math.random();
  }
}
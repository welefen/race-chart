import { Chart } from '../../common/chart';
import { deepmerge } from '../../common/util';
import { cloudConfig } from './config';
import { CloudConfig, CloudItemInfo, Placement } from './types';
import { Position } from '../../common/types';
import { Sprite, Block } from 'spritejs';

export class Cloud extends Chart {
  protected maxRadius: number;
  protected center: number[];
  protected maskPos: Position;
  protected grid: boolean[][] = [];
  protected pointsAtRadius: number[][][] = [];
  public config: CloudConfig;
  public setConfig(config: CloudConfig) {
    config = deepmerge({}, cloudConfig, this.config || {}, config || {});
    config.gridSize = Math.max(4, config.gridSize);
    super.setConfig(config);
  }
  protected drawGridItems(grid: boolean[][], color: string = 'rgba(0, 0, 0, 0.2)') {
    grid.forEach((lines, i) => {
      lines.forEach((item, j) => {
        if (!item) return;
        const x = this.maskPos.x + j * this.config.gridSize;
        const y = this.maskPos.y + i * this.config.gridSize;
        const node = new Block({
          bgcolor: color,
          width: this.config.gridSize,
          height: this.config.gridSize,
          x,
          y
        })
        this.layer.appendChild(node);
      })
    })
  }
  async render() {
    await super.render();
    let [y, paddingRight, paddingBottom, x] = <number[]>this.config.padding;
    let width = this.config.width - x - paddingRight;
    let height = this.config.height - y - paddingBottom;
    const titleHeight = await this.renderTitle({
      ...this.config.title,
      x, y, width, height
    })
    y += titleHeight;
    height -= titleHeight;
    const subTitleHeight = await this.renderTitle({
      ...this.config.subTitle,
      x, y, width, height
    })
    y += subTitleHeight;
    height -= subTitleHeight;
    this.maskPos = { x, y, width, height };
    const imageData: ImageData = await this.getMaskData(this.maskPos);
    this.grid = this.parseGridData(imageData);
    if (this.config.debug) {
      this.drawGridItems(this.grid);
    }
    const ngx = this.grid.length;
    const ngy = this.grid[0].length;
    this.maxRadius = Math.floor(Math.sqrt(ngx * ngx + ngy * ngy));
    this.center = [ngx / 2, ngy / 2];
  }
  private async getImageMaskData(pos: Position): Promise<ImageData> {
    const { image } = this.config.mask;
    const imgs = await this.scene.preload({ src: image });
    return this.getImageData(imgs[0], pos);
  }
  private drawMaskImage(img: HTMLImageElement) {
    const sprite = new Sprite({
      texture: img.src,
      ...this.maskPos,
      opacity: 0.3
    })
    this.layer.appendChild(sprite);
  }
  private getImageData(img: HTMLImageElement, pos: Position): ImageData {
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
    if (this.config.debug) {
      this.drawMaskImage(img);
    }
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
    // ctx.putImageData(imageData, 0, 0);
    canvas = null;
    return imageData;
  }
  protected getMaskData(pos: Position): Promise<ImageData> {
    const { image, text } = this.config.mask;
    if (image) {
      return this.getImageMaskData(pos);
    }
  }
  private getGridItemStatus(imageData: ImageData, row: number, column: number, gridSize: number, flag: boolean = false) {
    let index = 0;
    const { width, data } = imageData;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        index = (row * width * gridSize + i * width + column * gridSize + j) * 4 + 3;
        if (!flag) {
          if (!data[index]) return false;
        } else {
          if (data[index]) return true;
        }
      }
    }
    return flag ? false : true;
  }
  protected parseGridData(imageData: ImageData, flag?: boolean, gridSize: number = this.config.gridSize): boolean[][] {
    const { width, height } = imageData;
    const gridWidth = Math.ceil(width / gridSize);
    const gridHeight = Math.ceil(height / gridSize);
    const grid = [];
    for (let row = 0; row < gridHeight; row++) {
      grid[row] = [];
      for (let column = 0; column < gridWidth; column++) {
        grid[row][column] = this.getGridItemStatus(imageData, row, column, gridSize, flag);
      }
    }
    return grid;
  }
  protected getImageOccupied(imageData: ImageData, gridSize?: number) {
    const grid = this.parseGridData(imageData, true, gridSize);
    if (this.config.debug) {
      this.drawGridItems(grid, 'blue');
    }
    const occupied = [];
    grid.forEach((line, i) => {
      line.forEach((item, j) => {
        if (item) {
          occupied.push({ row: i, column: j });
        }
      })
    })
    return occupied;
  }
  protected getPointsAtRadius(radius: number, center: number[]): number[][] {
    if (this.pointsAtRadius[radius]) return this.pointsAtRadius[radius];
    if (!radius) return [[center[0], center[1], 0]];
    const num = radius * 8;
    const points = [];
    let cur = num;
    while (cur--) {
      const r = center[0] + radius * Math.cos(-cur / num * 2 * Math.PI);
      const th = center[1] + radius * Math.sin(-cur / num * 2 * Math.PI);
      const i = cur / num * 2 * Math.PI;
      points.push([r, th, i]);
    }
    this.pointsAtRadius[radius] = points;
    return points;
  }
  protected tryToPutAtPoint(point: number[], item: CloudItemInfo) {
    const { gridSize } = this.config;
    const gridX = Math.floor(point[0] - item.gridWidth / 2);
    const gridY = Math.floor(point[1] - item.gridHeight / 2);
    const gh = this.grid.length;
    const gw = this.grid[0].length;
    let index = item.occupied.length;
    while (index--) {
      const x = gridX + item.occupied[index].column;
      const y = gridY + item.occupied[index].row;
      if (x < 0 || y < 0 || x >= gw || y >= gh) {
        return false;
      }
      if (!this.grid[y][x]) {
        return false;
      }
    }
    const sprite = new Sprite({
      texture: item.canvas,
      width: item.width,
      height: item.height,
      x: gridX * gridSize + this.maskPos.x,
      y: gridY * gridSize + this.maskPos.y
    })
    this.layer.appendChild(sprite);
    // update status in grid
    let idx = item.occupied.length;
    while (idx--) {
      const x = gridX + item.occupied[idx].column;
      const y = gridY + item.occupied[idx].row;
      this.grid[y][x] = false;
    }
    return true;
  }
  protected getRotateDeg() {
    const { disabled, min, max, step } = this.config.rotate;
    if (disabled) return 0;
    let rotate = Math.random() * 360;
    if (step) {
      rotate = Math.floor(rotate / step) * step;
    }
    return Math.max(min, Math.min(max, rotate));
  }
}
import { Cloud } from '../common/cloud';
import { createLabel } from '../../common/util';

export class WordCloud extends Cloud {
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
    const imageData: ImageData = await this.renderMask({ x, y, width, height });
    // this.grid = this.parseGridData(imageData);
  }
  private putWord(str: string) {
    const info = this.getTextInfo(str, 20, 0);
  }
  private async getTextInfo(str: string, weight: number, deg: number) {
    let fontSize = weight * this.config.weightFactor;
    fontSize = Math.max(this.config.minFontSize, fontSize);
    const styles = { ...this.config.textStyle, fontSize, rotate: deg };
    const label = createLabel(str, styles);
    this.layer.appendChild(label);
    label.attr({ fillColor: 'red' });
    await label.textImageReady;
    const { image } = label.textImage;
    let { width, height } = label.getBoundingClientRect();
    width = Math.ceil(width / this.config.gridSize) * this.config.gridSize;
    height = Math.ceil(height / this.config.gridSize) * this.config.gridSize;
    const ctx = image.getContext('2d');
    const imageData: ImageData = ctx.getImageData(0, 0, width, height);
    const grid = this.parseGridData(imageData, true);
    return {
      width,
      height,
      grid,
      fontSize
    }
  }
  async start() {
    await this.render();
    this.putWord('lichengyin')
  }
}
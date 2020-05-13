import { Cloud } from '../common/cloud';

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
  }
  async start() {
    await this.render();
  }
}
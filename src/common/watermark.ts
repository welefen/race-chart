import { WatermarkConfig } from './types';
import { Layer, Sprite, Group, Label } from 'spritejs';
import { createLabel, createGroup } from './util';
// 水印
export class Watermark {
  private config: WatermarkConfig;
  private group: Group;
  constructor(config: WatermarkConfig) {
    this.config = config;
  }
  async appendTo(layer: Layer) {
    const { image, text } = this.config;
    if (!image && !text) return;
    this.group = createGroup(this.config);
    layer.appendChild(this.group);
    let item = await this.create(this.group);
    const rect = item.getBoundingClientRect();
    const x = Math.abs(rect.x);
    const y = Math.abs(rect.y);
    const hNum = Math.floor((this.config.width - x) / rect.width / 3);
    const hDelta = (this.config.width - x - hNum * rect.width * 3) / hNum / 2;
    const vNum = Math.floor((this.config.height - y) / rect.height / 3);
    const vDelta = (this.config.height - y - vNum * rect.height * 3) / vNum / 2;
    for (let i = 0; i < hNum; i++) {
      for (let j = 0; j < vNum; j++) {
        if (i !== 0 || j !== 0) {
          item = <Sprite | Label>item.cloneNode(true);
          this.group.appendChild(item);
        }
        item.attr({
          x: x + rect.width * 3 * i + rect.width + hDelta * (i * 2 + 1),
          y: y + rect.height * 3 * j + rect.height + vDelta * (j * 2 + 1)
        })
      }
    }
  }
  private async create(group: Group): Promise<Sprite | Label> {
    const { text, image, rotate, opacity } = this.config;
    if (image) {
      const sprite = new Sprite({
        texture: image,
        rotate,
        opacity,
        anchor: [0.5, 0.5]
      })
      group.appendChild(sprite);
      return sprite.textureImageReady.then(_ => sprite);
    }
    const label = createLabel(text, this.config);
    label.attr({ rotate, opacity, anchor: [0.5, 0.5] });
    group.appendChild(label)
    return label.textImageReady.then(_ => label);
  }
}
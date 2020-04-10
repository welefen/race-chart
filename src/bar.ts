import { Group, Label, Rect, Sprite } from 'spritejs';
import deepmerge from 'ts-deepmerge';

import { BarConfig } from './type';
import { splitValue, createLabel } from './util';

export class Bar {
  private group: Group;
  private label: Label;
  private rect: Rect;
  private value: Label;
  private logo: Sprite;
  config: BarConfig;
  values?: number[];
  index: number = 0;
  constructor(config: BarConfig, index?: number, values?: number[]) {
    this.config = deepmerge({}, config);
    const { x, y, width, height } = this.config;
    this.group = new Group({ x, y, width, height });
    this.index = index;
    this.values = values;
  }
  attr(attrs: Record<string, any>) {
    this.group.attr(attrs);
  }
  async appendTo(node: Group) {
    node.appendChild(this.group);
    await this.initLabel();
    this.initRect();
    await this.initLogo();
    return this.initValue();
  }
  private initLabel() {
    const { width, text } = this.config.label;
    this.label = createLabel(text || '', this.config.label);
    this.group.appendChild(this.label);
    return this.label.textImageReady.then(() => {
      const [w, height] = this.label.clientSize;
      this.label.attr({
        x: width - w,
        y: Math.round((this.config.height - height) / 2)
      })
    })
  }
  private initRect() {
    const rectConfig = this.config.rect;
    this.rect = new Rect({
      height: this.config.height,
      fillColor: rectConfig.color,
      x: this.config.label.width + this.config.justifySpacing
    });
    this.group.appendChild(this.rect);
    this.rectWidth = rectConfig.width;
  }
  set rectWidth(width: number) {
    const rectConfig = this.config.rect;
    if (rectConfig.minWidth) {
      width = Math.max(width, rectConfig.minWidth);
    }
    this.config.rect.width = width;
    this.rect.attr({
      width
    })
    this.updateValueX();
    this.updateLogoX();
  }
  private initValue() {
    this.value = createLabel('', this.config.value);
    this.value.attr({ width: this.config.value.width })
    this.group.appendChild(this.value);
    return this.value.textImageReady.then(() => {
      const [_, height] = this.value.clientSize;
      this.value.attr({
        y: Math.round((this.config.height - height) / 2)
      })
      this.updateValueX();
    })
  }
  private initLogo() {
    const { logo } = this.config;
    if (!logo.src || logo.disabled) return;
    const sprite = new Sprite({
      texture: logo.src,
      width: logo.width,
      height: logo.height,
      borderRadius: logo.radius
    })
    this.logo = sprite;
    this.group.appendChild(sprite);
    return sprite.textureImageReady.then(() => {
      const [width, height] = sprite.clientSize;
      if (!logo.width) logo.width = width;
      if (!logo.height) logo.height = height;
      sprite.attr({
        y: (this.config.height - height) / 2
      })
      this.updateLogoX();
    })
  }
  set valueText(value: number) {
    const valueConf = this.config.value;
    const prevValue = valueConf.value;
    if (prevValue && prevValue === value) return;
    valueConf.value = value;
    const text = splitValue(value, this.config.valueSplit.type, this.config.valueSplit.length);
    this.value.attr({ text });
  }
  private updateValueX() {
    if (!this.value) return;
    this.value.attr({
      x: this.config.label.width + this.config.rect.width + this.config.justifySpacing * 2
    })
  }
  private updateLogoX() {
    if (!this.logo) return;
    this.logo.attr({
      x: this.config.label.width + this.config.rect.width - (this.config.logo.width || 0),
      opacity: this.config.rect.width > this.config.logo.width ? 1 : 0
    })
  }
}
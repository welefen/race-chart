import { Group, Label, Rect } from 'spritejs';
import { BarConfig, BarDataItem } from './type';
import deepmerge from 'ts-deepmerge';
import { splitValue } from './util';

export class Bar {
  private group: Group;
  private label: Label;
  private rect: Rect;
  private value: Label;
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
    await this.initLabel();
    this.initRect();
    await this.initValue();
    node.appendChild(this.group);
  }
  private initLabel() {
    const nameConfig = this.config.label;
    this.label = new Label(nameConfig.text || '');
    this.label.attr({
      font: `${nameConfig.fontSize}px ${nameConfig.fontFamily}`,
      fillColor: nameConfig.color,
      // bgcolor: 'red'
    });
    this.group.appendChild(this.label);
    return this.label.textImageReady.then(() => {
      const [width, height] = this.label.clientSize;
      this.label.attr({
        x: nameConfig.width - width,
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
  }
  private initValue() {
    const valueConfig = this.config.value;
    this.value = new Label('');
    this.value.attr({
      font: `${valueConfig.fontSize}px ${valueConfig.fontFamily}`,
      fillColor: valueConfig.color,
      width: valueConfig.width
    })
    this.valueText = valueConfig.value;
    this.group.appendChild(this.value);
    return this.value.textImageReady.then(() => {
      const [_, height] = this.value.clientSize;
      this.value.attr({
        y: Math.round((this.config.height - height) / 2)
      })
      this.updateValueX();
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
}
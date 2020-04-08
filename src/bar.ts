import { Group, Label, Rect } from 'spritejs';
import { BarConfig } from './config';
import deepmerge from 'ts-deepmerge';
import { spitValueWidthComma } from './util';
import TWEEN from '@tweenjs/tween.js';

const defaultConfig: BarConfig = {
  x: 0,
  y: 0,
  width: 100,
  height: 30,
  spacing: 5, // name, rect, value 之间的间距
  label: {
    text: 'name',
    fontSize: 16,
    fontFamily: '"宋体"',
    color: '#333',
    width: 100
  },
  value: {
    value: 0,
    fontSize: 14,
    fontFamily: '"宋体"',
    color: '#333',
    width: 100,
    split: {
      type: ',',
      length: 3
    }
  },
  rect: {
    minWidth: 10,
    width: 0,
    color: 'red',
  }
}

export class Bar {
  private group: Group;
  private label: Label;
  private rect: Rect;
  private value: Label;
  config: BarConfig;
  labelPromise: Promise<any>;
  constructor(config: BarConfig) {
    this.config = deepmerge({}, defaultConfig, config);
    this.group = new Group({
      x: this.config.x,
      y: this.config.y,
      height: this.config.height,
      width: this.config.width
    });
    this.initRect();
    const p1 = this.initLabel();
    const p2 = this.initValue();
    this.labelPromise = Promise.all([p1, p2]);
  }
  get values() {
    return this.config.values;
  }
  attr(attrs: Record<string, any>) {
    this.group.attr(attrs);
  }
  appendTo(node: Group) {
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
      x: this.config.label.width + this.config.spacing
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
    const prevValue = this.config.value.value;
    if (prevValue && prevValue === value) return;
    this.config.value.value = value;
    const text = spitValueWidthComma(value, 3);
    this.value.attr({
      text
    })
  }
  private updateValueX() {
    if (!this.value) return;
    this.value.attr({
      x: this.config.label.width + this.config.rect.width + this.config.spacing * 2
    })
  }
}
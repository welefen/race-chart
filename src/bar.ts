import { Group, Label, Rect } from 'spritejs';
import { BarConfig } from './config';
import deepmerge from 'ts-deepmerge';
import { spitValueWidthComma } from './util';
import TWEEN from '@tweenjs/tween.js';

const defaultConfig: BarConfig = {
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
  group: Group;
  name: Label;
  rect: Rect;
  value: Label;
  config: BarConfig;
  constructor(config: BarConfig) {
    this.config = deepmerge({}, defaultConfig, config);
    this.group = new Group({
      height: this.config.height,
      width: this.config.width
    });
    this.initLabel();
    this.initRect();
    this.initValue();
  }
  initLabel() {
    const nameConfig = this.config.label;
    this.name = new Label(nameConfig.text || '');
    this.name.attr({
      font: `${nameConfig.fontSize}px ${nameConfig.fontFamily}`,
      fillColor: nameConfig.color
    });
    this.group.appendChild(this.name);
    return this.name.textImageReady.then(() => {
      const [width, height] = this.name.clientSize;
      this.name.attr({
        x: nameConfig.width - width,
        y: Math.round((this.config.height - height) / 2)
      })
    })
  }
  initRect() {
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
  initValue() {
    const valueConfig = this.config.value;
    this.value = new Label('');
    this.value.attr({
      font: `${valueConfig.fontSize}px ${valueConfig.fontFamily}`,
      fillColor: valueConfig.color,
      width: valueConfig.width
    })
    this.valueText = valueConfig.value;
    this.group.appendChild(this.value);
    const start = Date.now();
    return this.value.textImageReady.then(() => {
      const [_, height] = this.value.clientSize;
      valueConfig.textHeight = height;
      this.value.attr({
        y: Math.round((this.config.height - height) / 2)
      })
      this.updateValueX();
    })
  }
  set valueText(value: number) {
    if (this.config.value.value && this.config.value.value === value) return;
    this.config.value.value = value;
    const text = spitValueWidthComma(value, 3);
    this.value.attr({
      text
    })
  }
  updateValueX() {
    if (!this.value) return;
    this.value.attr({
      x: this.config.label.width + this.config.rect.width + this.config.spacing * 2
    })
  }
  update(rectWidth: number, value: number) {
    const data = {
      rectWidth: this.config.rect.width,
      value: this.config.value.value
    }
    const tween = new TWEEN.Tween(data).to({
      rectWidth,
      value
    }, 2000).easing(TWEEN.Easing.Linear.None).onUpdate(() => {
      this.rectWidth = (data.rectWidth);
      this.valueText = Math.floor(data.value);
    }).start();
    return new Promise(resolve => {
      tween.onComplete(() => {
        resolve();
      });
    })
  }
}
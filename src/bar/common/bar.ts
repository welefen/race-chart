import { Group, Label, Sprite, Polyline, Block, Parallel } from 'spritejs';
import { deepmerge } from '../../common/util';

import { BarConfig } from './types';
import { createLabel, createGroup } from '../../common/util';

export class Bar {
  private group: Group;
  private label: Label;
  private rect: Group;
  private polylines: Polyline[] = [];
  private value: Label;
  private logo: Sprite;
  config: BarConfig;
  values?: number[];
  index: number = 0;
  constructor(config: BarConfig, index?: number, values?: number[]) {
    this.config = deepmerge({}, config);
    this.group = createGroup(this.config);
    // this.group.attr({bgcolor: 'blue'})
    this.index = index;
    this.values = values;
  }
  attr(attrs: Record<string, any>) {
    this.group.attr(attrs);
  }
  async appendTo(node: Group) {
    node.appendChild(this.group);
    this.initLabel();
    this.initRect();
    await this.initLogo();
    return this.initValue();
  }
  private initLabel() {
    const { width, text } = this.config.label;
    if (this.config.label.color === 'currentColor') {
      this.config.label.color = this.config.color;
    }
    this.label = createLabel(text || '', this.config.label);
    this.label.attr({
      width,
      fillColor: this.config.label.color,
      textAlign: 'right',
      lineHeight: this.config.height
    })
    this.group.appendChild(this.label);
  }
  private initRect() {
    const rectConfig = this.config.rect;
    if (rectConfig.type === '3d') {
      const { sideHeight, angle } = rectConfig;
      const sinAngle = Math.sin(angle / 180 * Math.PI);
      const cosAngle = Math.cos(angle / 180 * Math.PI);
      const left = this.config.label.width + this.config.justifySpacing - sideHeight * cosAngle;
      this.rect = new Group({
        width: rectConfig.width,
        height: this.config.height,
        bgcolor: this.config.color,
        opacity: .95,
        x: left
      });
      this.group.appendChild(this.rect);
      const strokeColor = 'rgba(255, 255, 255, 0.3)';
      const topp = new Parallel({
        sides: [rectConfig.width, sideHeight],
        x: left + sideHeight * sinAngle,
        y: -sideHeight * cosAngle,
        angle: angle + 90,
        lineWidth: 0.5,
        strokeColor,
        fillColor: this.config.color,
      });
      this.polylines.push(topp);
      this.group.appendChild(topp);
      const rightp = new Parallel({
        sides: [this.config.height, sideHeight],
        x: left + sideHeight * sinAngle,
        y: -sideHeight * cosAngle,
        angle,
        rotate: 90,
        lineWidth: 0.5,
        strokeColor,
        fillColor: this.config.color,
      });
      this.polylines.push(rightp);
      this.group.appendChild(rightp);
    } else {
      this.rect = new Group({
        height: this.config.height,
        bgcolor: this.config.color,
        borderTopRightRadius: [rectConfig.radius, rectConfig.radius],
        borderBottomRightRadius: [rectConfig.radius, rectConfig.radius],
        x: this.config.label.width + this.config.justifySpacing
      });
      this.group.appendChild(this.rect);
    }
    this.rectWidth = rectConfig.width;
  }
  set rectWidth(width: number) {
    const rectConfig = this.config.rect;
    if (rectConfig.minWidth) {
      width = Math.max(width, rectConfig.minWidth);
    }
    this.config.rect.width = width;
    this.rect.attr({ width });
    if (this.polylines.length) {
      const { sideHeight, angle } = rectConfig;
      this.polylines[0].attr({ sides: [width, sideHeight] });
      const delta = sideHeight * (Math.sin(angle / 180 * Math.PI) - Math.cos(angle / 180 * Math.PI));
      this.polylines[1].attr({
        opacity: width ? 1 : 0,
        x: this.config.rect.width + this.config.label.width + this.config.justifySpacing + delta
      })
    }
    this.updateValueX();
    this.updateLogoX();
  }
  private initValue() {
    if (this.config.value.color === 'currentColor') {
      this.config.value.color = this.config.color;
    }
    this.value = createLabel('', this.config.value);
    this.value.attr({
      width: this.config.value.width,
      lineHeight: this.config.height
    })
    this.group.appendChild(this.value);
    this.updateValueX();
  }
  private initLogo() {
    const { logo } = this.config;
    if (!logo.image || logo.disabled) return;
    const sprite = new Sprite({
      texture: logo.image
    })
    this.logo = sprite;
    this.group.appendChild(sprite);
    return sprite.textureImageReady.then(() => {
      let [width, height] = sprite.clientSize;
      width *= this.config.height / height;
      sprite.attr({
        width,
        height: this.config.height
      })
      this.updateLogoX();
    })
  }
  set valueText(value: number) {
    this.config.value.value = value;
    const text = this.config.value.formatter(value, 'column');
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
      x: this.config.label.width + this.config.justifySpacing
    })
  }
}
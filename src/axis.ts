import { AxisConfig, Tick } from './type';
import { Group, Layer, Polyline, Label } from 'spritejs';
import { splitValue } from './util';
import deepmerge from 'ts-deepmerge';

export class Axis {
  config: AxisConfig;
  group: Group;
  ticks: Tick[] = [];
  maxValue: number = 0;
  step: number = 0;
  constructor(config: AxisConfig) {
    this.config = deepmerge({}, config);
    this.group = new Group({
      width: this.config.width,
      height: this.config.height,
      x: this.config.x,
      y: this.config.y,
    })
  }
  private getTickValues(value: number) {
    const item = Math.floor(value / this.config.maxTick).toString();
    const itemValue = item.length === 1 ? parseInt(item, 10) : parseInt(item.substr(0, 1), 10) * Math.pow(10, item.length - 1);
    return [...new Array(this.config.maxTick + 1)].map((_, index) => index * itemValue);
  }
  // 更新 tick 的 x 位置
  private updateTicksX(percent: number) {
    const opacity = 1 - percent;
    this.ticks.forEach(tick => {
      const x = tick.value / this.maxValue * this.config.width;
      tick.group.attr({ x });
      if (tick.remove) {
        tick.group.attr({ opacity });
      }
    })
  }
  private addTicks(values: number[]) {
    values.forEach(value => {
      const x = Math.floor(value / this.maxValue * this.config.width);
      const group = this.generateTick(x, value);
      this.group.appendChild(group);
      this.ticks.push({ value, group });
    })
  }
  private generateTick(x: number, value: number) {
    const group = new Group({
      x,
      y: 0,
      width: 20,
      height: this.config.height
    })
    const valueStr = splitValue(value, this.config.valueSplit.type, this.config.valueSplit.length);
    const label = new Label(valueStr);
    label.attr({
      font: `${this.config.fontSize}px ${this.config.fontFamily}`,
      fillColor: this.config.color,
    });
    group.appendChild(label);
    label.textImageReady.then(() => {
      const [width, height] = label.clientSize;
      label.attr({
        x: - Math.floor(width / 2)
      })
      return height;
    });
    const line = new Polyline({
      points: [0, 20, 0, this.config.height],
      strokeColor: this.config.lineColor,
      lineWidth: 1
    });
    group.appendChild(line);
    return group;
  }
  setMaxValue(value: number) {
    this.maxValue = value;
    const values = this.getTickValues(value);
    if (this.ticks.length === 0) return this.addTicks(values);
    // // 去除已经有的 value
    // const newValues = values.filter(value => {
    //   return !this.ticks.some(item => item.value === value);
    // })
    // // 如果已有的 tick 在新的里面不存在，则删除
    // this.ticks = this.ticks.filter(tick => {
    //   const flag = values.some(value => value === tick.value);
    //   if (!flag) {
    //     this.group.removeChild(tick.group);
    //   }
    //   return flag;
    // })
    // if (newValues.length === 0) return;
    // this.updateTicks(this.ticks.length ? [] : values);
  }
  beforeAnimate(value: number) {
    const values = this.getTickValues(value);
    if (!this.maxValue) {
      this.maxValue = value;
      return this.addTicks(values);
    } else {
      // 如果已有的 tick 在新的里面不存在，标记删除
      this.ticks.forEach(tick => {
        const flag = values.some(value => value === tick.value);
        if (!flag) {
          tick.remove = true;
        }
      })
    }
  }
  afterAnimate(value: number) {
    this.ticks = this.ticks.filter(tick => {
      if (tick.remove) {
        this.group.removeChild(tick.group);
        return false;
      }
      return true;
    })
    const values = this.getTickValues(value);
    // 去除已经有的 value
    const newValues = values.filter(value => {
      return !this.ticks.some(item => item.value === value);
    })
    console.log('newValues', newValues)
    if (newValues.length === 0) return;
    this.addTicks(newValues);
  }
  update(prevValue: number, value: number, percent: number) {
    if (prevValue === value || value < this.maxValue) return;
    const v = Math.floor(prevValue + (value - prevValue) * percent);
    this.maxValue = v;
    this.updateTicksX(percent);
  }
  appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}
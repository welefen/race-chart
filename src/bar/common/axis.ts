import { Group, Layer, Polyline } from 'spritejs';
import { AxisTick } from './types';
import { AxisConfig } from '../../common/types';
import { createLabel, createGroup } from '../../common/util';
import { BarChart } from './barChart';

export class Axis {
  config: AxisConfig;
  private group: Group;
  private ticks: AxisTick[] = [];
  private maxValue: number = 0;
  private step: number = 0;
  constructor(config: AxisConfig) {
    this.config = config;
    this.group = createGroup(this.config);
  }
  private getSteps(value: number) {
    const item = Math.floor(value / this.config.maxTick).toString();
    let itemValue = item.length === 1 ? parseInt(item, 10) : parseInt(item.substr(0, 1), 10) * Math.pow(10, item.length - 1);
    itemValue = Math.max(1, itemValue);
    return [...new Array(this.config.maxTick)].map((_, index) => (index + 1) * itemValue);
  }
  // 更新 tick 的 x 位置
  private updateTicksX(percent: number) {
    this.ticks.forEach(tick => {
      const x = tick.value / this.maxValue * this.config.width;
      tick.group.attr({ x });
      if (tick.remove) {
        tick.group.attr({ opacity: Math.max(0, 1 - percent * 3) });
      } else if (tick.value < this.maxValue) {
        tick.group.attr({ opacity: 1 });
      }
    })
  }
  private addTicks(values: number[]) {
    if (values.length === 0) return;
    values.forEach(value => {
      const flag = this.ticks.some(tick => tick.value === value && !tick.remove);
      if (flag) return;
      const x = Math.floor(value / (this.maxValue || 1) * this.config.width);
      const group = this.generateTick(x, value);
      if (value > this.maxValue) {
        group.attr({ opacity: 0 });
      }
      this.group.appendChild(group);
      this.ticks.push({ value, group });
    })
    // 从小到大排序
    this.ticks.sort((a, b) => {
      return a.value > b.value ? 1 : -1;
    })
  }
  private generateTick(x: number, value: number) {
    const group = new Group({
      x,
      y: 0,
      width: 20,
      height: this.config.height
    })
    const valueStr = this.config.formatter(value, 'axis').toString();
    const label = createLabel(valueStr, this.config);
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
  private getFormatValue(value: number) {
    const str = value.toString();
    if (str.length <= 2) return value;
    return parseInt(str.substr(0, 2)) * Math.pow(10, str.length - 2);
  }
  beforeAnimate(barChart: BarChart) {
    const value = barChart.maxValues[barChart.index];
    const scaleType = barChart.config.scaleType;
    if (!this.maxValue) {
      this.maxValue = value;
      const steps = this.getSteps(value);
      this.step = steps[0];
      return this.addTicks([0].concat(steps));
    }
    if (scaleType === 'fixed') return;
    const max = this.ticks[this.ticks.length - 1].value;
    if (max + this.step < value) {
      let num = 0;
      let maxValue = 0;
      const newSteps = this.getSteps(value);
      if (max < newSteps[0]) {
        this.ticks.forEach((tick, index) => {
          if (!index) return;
          tick.remove = true;
        })
        this.step = newSteps[0];
        this.addTicks(newSteps);
      } else {
        this.ticks.forEach((tick, index) => {
          if (index % 2 === 1) {
            tick.remove = true;
            num++;
          } else {
            maxValue = tick.value;
          }
        })
        this.step *= 2;
        if (num) {
          const values = [];
          while (num) {
            values.push(this.getFormatValue(maxValue + this.step));
            num--;
            maxValue += this.step;
          }
          this.addTicks(values);
        }
      }
    }
  }
  afterAnimate(barChart: BarChart) {
    const scaleType = barChart.config.scaleType;
    if (scaleType === 'fixed') return;
    this.ticks = this.ticks.filter(tick => {
      if (!tick.remove) return true;
      this.group.removeChild(tick.group);
    })
  }
  update(barChart: BarChart, percent: number) {
    const prevValue = barChart.index === 0 ? 0 : barChart.maxValues[barChart.index - 1];
    const value = barChart.maxValues[barChart.index];
    if (prevValue === value) return;
    const v = Math.floor(prevValue + (value - prevValue) * percent);
    if (!v) return;
    this.maxValue = v;
    this.updateTicksX(percent);
  }
  appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}
import { AxisConfig, Tick } from './type';
import { Group, Layer, Polyline, Label } from 'spritejs';
import { splitValue } from './util';
import deepmerge from 'ts-deepmerge';

export class Axis {
  config: AxisConfig;
  group: Group;
  ticks: Tick[] = [];
  maxValue: number;
  constructor(config: AxisConfig) {
    this.config = deepmerge({}, config);
    this.group = new Group({
      width: this.config.width,
      height: this.config.height,
      x: this.config.x,
      y: this.config.y,
      // bgcolor: 'red'
    })
  }
  private getTickValues(value: number) {
    const item = Math.floor(value / this.config.maxTick).toString();
    const itemValue = item.length === 1 ? parseInt(item, 10) : parseInt(item.substr(0, 1), 10) * Math.pow(10, item.length - 1);
    return [...new Array(this.config.maxTick)].map((_, index) => index * itemValue);
  }
  private updateTicks(values: number[]) {
    const ticks = values.map(value => {
      const x = Math.floor(value / this.maxValue * this.config.width);
      const group = this.generateTick(x, value);
      this.group.appendChild(group);
      return {
        value,
        group
      }
    })
  }
  generateTick(x: number, value: number) {
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
    this.updateTicks(values);
  }
  appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}
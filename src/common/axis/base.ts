import { AxisConfig, AxisTick, AnimateConfig } from "../types";
import { Layer, Group, Polyline } from 'spritejs';
import { createGroup, createLabel } from "../util";

export class BaseAxis {
  protected group: Group;
  protected ticks: AxisTick[] = [];
  protected config: AxisConfig;
  constructor(config: AxisConfig) {
    this.config = config;
    this.group = createGroup(config);
  }
  appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
  private generateColumnTick(str: string): Group {
    const group = new Group({
      width: this.config.line.width,
      height: this.config.height
    })
    const { pos, height } = this.config.label;
    const props = pos === 'top' ? [height, this.config.height, 0] : [0, this.config.height - height, this.config.height - height];
    const label = createLabel(str, this.config.label);
    group.appendChild(label);
    label.textImageReady.then(() => {
      const [width] = label.clientSize;
      label.attr({
        height: this.config.label.height,
        x: - Math.floor(width / 2),
        y: props[2]
      })
    });
    const line = new Polyline({
      points: [0, props[0], 0, props[1]],
      strokeColor: this.config.line.color,
      lineWidth: this.config.line.width
    });
    group.appendChild(line);
    return group;
  }
  private generateRowTick(str: string) {
    const group = new Group({
      width: this.config.width,
      height: this.config.line.width,
    })
    const label = createLabel(str, this.config.label);
    label.attr({
      width: this.config.label.width,
      textAlign: 'right',
      paddingRight: 5,
    })
    group.appendChild(label);
    label.textImageReady.then(() => {
      const [_, height] = label.clientSize;
      label.attr({
        y: - height / 2 - 1
      })
    });
    const line = new Polyline({
      points: [this.config.label.width, 0, this.config.width, 0],
      strokeColor: this.config.line.color,
      lineWidth: this.config.line.width
    });
    group.appendChild(line);
    return group;
  }
  private generateTick(str: string) {
    if (this.config.type === 'column') {
      return this.generateColumnTick(str);
    }
    return this.generateRowTick(str);
  }
  protected addTicks(ticks: AxisTick[]) {
    if (ticks.length === 0) return;
    ticks.forEach(item => {
      const flag = this.ticks.some(tick => tick.label === item.label && !tick.remove);
      if (flag) return;
      const group = this.generateTick(item.label);
      this.group.appendChild(group);
      this.ticks.push({ label: item.label, value: item.value, group });
    })
  }
  protected beforeAnimate(data: AnimateConfig) {

  }
  protected onUpdate(data: AnimateConfig) {

  }
  protected afterAnimate(data: AnimateConfig) {

  }
}
import { LineGroupConfig } from './types';
import { Group, Layer } from 'spritejs';
import { createGroup } from '../../common/util';
import { LineNode } from './lineNode';

export class LineGroup {
  private config: LineGroupConfig;
  private group: Group;
  private lineNodes: LineNode[] = [];
  constructor(config: LineGroupConfig) {
    this.config = config;
    this.group = createGroup(config);
    this.initLineNodes();
  }
  public initLineNodes() {
    const { colors } = this.config;
    this.lineNodes = this.config.data.data.map((item, index) => {
      const instance = new LineNode({
        color: colors[index % colors.length]
      }, item.values);
      instance.appendTo(this.group);
      return instance;
    })
  }
  public beforeAnimate(index: number, maxValue: number, oldMaxValue: number) {

  }
  public onUpdate(index: number, percent: number, maxTick: number, oldMaxValue: number, maxValue: number) {
    const { height, width } = this.config;
    const itemWidth = width / maxTick;
    const delta = index > maxTick ? index - maxTick : 0;
    maxValue = oldMaxValue + (maxValue - oldMaxValue) * percent;
    this.lineNodes.forEach((lineNode, idx) => {
      const points = [];
      lineNode.values.some((value, valIdx) => {
        if (valIdx > index) return true;
        if (valIdx < index - maxTick) return;
        // 最后一个
        if (index && valIdx === index) {
          let x = (valIdx - 1) * itemWidth + itemWidth * percent;
          if (delta) {
            x = width;
          }
          const prevValue = lineNode.values[index - 1];
          const curValue = prevValue + (value - prevValue) * percent;
          const y = (maxValue - curValue) / maxValue * height;
          points.push(x, y);
        } else if (delta && valIdx === delta) {
          const prevValue = lineNode.values[valIdx - 1];
          const curValue = prevValue + (value - prevValue) * percent;
          const y = (maxValue - curValue) / maxValue * height;
          points.push(0, y);
        } else if (valIdx < index) {
          let x = valIdx * itemWidth;
          if (delta) {
            x = (valIdx - delta) * itemWidth + itemWidth * (1 - percent);
          }
          const y = (maxValue - value) / maxValue * height;
          points.push(x, y);
        }
      })
      lineNode.update(points, 1);
    })
  }
  public afterAnimate() {

  }
  public appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}
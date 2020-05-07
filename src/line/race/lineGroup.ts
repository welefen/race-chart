import { LineGroupConfig, AnimateData } from './types';
import { Group, Layer } from 'spritejs';
import { createGroup } from '../../common/util';
import { LineNode } from './lineNode';

const allPoints = [];
export class LineGroup {
  private config: LineGroupConfig;
  private group: Group;
  private lineNodes: LineNode[] = [];
  private animateData: AnimateData[];
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
    const prevIndex = index ? index - 1 : index;
    this.animateData = this.lineNodes.map(lineNode => {
      return {
        value: lineNode.values[index],
        oldValue: lineNode.values[prevIndex],
        maxValue,
        oldMaxValue
      }
    })
  }
  public onUpdate(index: number, percent: number) {
    const maxTick = this.config.xAxis.maxTick;
    const { height, width } = this.config;
    const itemWidth = width / maxTick;
    this.lineNodes.forEach((lineNode, idx) => {
      const points = [];
      const animateData = this.animateData[idx];
      const maxValue = animateData.oldMaxValue + (animateData.maxValue - animateData.oldMaxValue) * percent;
      lineNode.values.some((value, valIdx) => {
        if (valIdx > index) return true;
        if (index && valIdx === index) {
          const x = (valIdx - 1) * itemWidth + itemWidth * percent;
          const prevValue = lineNode.values[index - 1];
          const curValue = prevValue + (value - prevValue) * percent;
          const y = (maxValue - curValue) / maxValue * height;
          points.push(x, y);
        } else if (valIdx < index) {
          const x = valIdx * itemWidth;
          const y = (maxValue - value) / maxValue * height;
          points.push(x, y);
        }
      })
      lineNode.update(points, 1);
      allPoints.push(points)
    })
  }
  public afterAnimate() {
    // console.log(JSON.stringify(allPoints))
  }
  public appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}
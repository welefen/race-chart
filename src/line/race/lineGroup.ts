import { LineGroupConfig } from './types';
import { Group, Layer } from 'spritejs';
import { createGroup, deepmerge } from '../../common/util';
import { LineNode } from './lineNode';
import { AnimateConfig } from '../../common/types';

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
      const instance = new LineNode(deepmerge(this.config.line, {
        label: {
          text: item.label
        },
        line: {
          color: colors[index % colors.length]
        }
      }), item.values);
      instance.appendTo(this.group);
      return instance;
    })
  }
  public onUpdate(data: AnimateConfig) {
    let { percent, index, maxValue, oldMaxValue } = data;
    const { height, width } = this.config;
    const maxTick = this.config.xAxis.maxTick;
    const itemWidth = width / maxTick;
    const delta = index > maxTick ? index - maxTick : 0;
    const isRank = this.config.scoreType === 'rank';
    maxValue = oldMaxValue + (maxValue - oldMaxValue) * percent;
    this.lineNodes.forEach((lineNode, idx) => {
      const points = [];
      lineNode.values.some((value, valIdx) => {
        if (valIdx > index) return true;
        if (valIdx < delta) return;
        let x = 0;
        let y = 0;
        // 最后一个
        if (index && valIdx === index) {
          if (delta) {
            x = width;
          } else {
            x = (valIdx - 1) * itemWidth + itemWidth * percent;
          }
          const prevValue = lineNode.values[index - 1];
          const curValue = prevValue + (value - prevValue) * percent;
          if (isRank) {
            y = (curValue - 1) / (maxValue - 1) * height;
          } else {
            y = (maxValue - curValue) / maxValue * height;
          }
          points.push(x, y);
        } else if (delta && valIdx === delta) { // 第一个
          const prevValue = lineNode.values[valIdx - 1];
          const curValue = prevValue + (value - prevValue) * percent;
          if (isRank) {
            y = (curValue - 1) / (maxValue - 1) * height;
          } else {
            y = (maxValue - curValue) / maxValue * height;
          }
          points.push(x, y);
          const x1 = itemWidth * (1 - percent);
          let y1 = 0;
          if (isRank) {
            y1 = (value - 1) / (maxValue - 1) * height;
          } else {
            y1 = (maxValue - value) / maxValue * height;
          }
          points.push(x1, y1);
        } else {
          if (delta) {
            x = (valIdx - delta) * itemWidth + itemWidth * (1 - percent);
          } else {
            x = valIdx * itemWidth;
          }
          if (isRank) {
            y = (value - 1) / (maxValue - 1) * height;
          } else {
            y = (maxValue - value) / maxValue * height;
          }
          points.push(x, y);
        }
      })
      lineNode.update(points, lineNode.values[index]);
    })
  }
  public afterAnimate() {
    // console.log('after')
  }
  public appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}
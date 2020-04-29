import { BarsConfig, AnimateData } from './types';
import { createGroup, createLabel } from '../../common/util';
import { Group, Layer, Label } from 'spritejs';
import { Bar } from '../common/bar';
import { BarRank } from './index';
import deepmerge from 'deepmerge';

export class Bars {
  private animateData: AnimateData[] = [];
  private rectMaxWidth: number; // 矩形最大宽度
  private barHeight: number; // 单个 bar 的高度
  private rankLabels: Label[] = [];
  config: BarsConfig;
  group: Group;
  bars: Bar[] = [];
  constructor(config: BarsConfig) {
    this.config = config;
    this.group = createGroup(this.config);
    const { width, height, showNum } = this.config;
    const { label, value, justifySpacing, alignSpacing } = this.config.bar;
    this.rectMaxWidth = width - label.width - value.width - 2 * justifySpacing;
    this.barHeight = (height - alignSpacing * (showNum - 1)) / showNum;
  }
  private async initRankLabel() {
    const { rank } = this.config.bar;
    const nameLabel = createLabel('', rank);
    nameLabel.attr({
      textAlign: 'right',
      width: this.config.width,
      boxSizing: 'border-box'
    })
    this.group.appendChild(nameLabel);
    await nameLabel.textImageReady;
    const [_, height] = nameLabel.clientSize;
    nameLabel.attr({
      y: this.config.height - height
    })
    const rankLabel = createLabel('', rank);
    rankLabel.attr({
      textAlign: 'right',
      width: this.config.width,
      y: this.config.height - height * 2,
      boxSizing: 'border-box'
    })
    this.group.appendChild(rankLabel);
    this.rankLabels = [rankLabel, nameLabel];
  }
  private async createBar(barRank: BarRank) {
    const { data, colors } = barRank.config;
    const item = data[barRank.index];
    const color = colors[barRank.index % colors.length];
    const config = deepmerge(this.config.bar, {
      width: this.config.width,
      height: this.barHeight,
      label: {
        text: item.label
      },
      color,
      value: {
        value: item.value,
        formatter: this.config.formatter
      },
      logo: {
        image: item.image
      }
    })
    const bar = new Bar(config, 0, [item.value]);
    await bar.appendTo(this.group);
    bar.valueText = item.value;
    return bar;
  }
  async beforeAnimate(barRank: BarRank) {
    const bar = await this.createBar(barRank);
    this.bars.push(bar);
    const { data, showNum, colors } = barRank.config;
    const currentData = data[barRank.index];

    this.rankLabels[0].attr({
      text: this.config.bar.rank.formatter(data.length - barRank.index)
    })
    this.rankLabels[1].attr({
      fillColor: colors[barRank.index % colors.length],
      text: currentData.label
    })


    const maxValue = barRank.maxValues[barRank.index];

    const lastData = barRank.index === data.length - 1;
    const length = this.bars.length;
    this.animateData = this.bars.map((bar, index) => {
      const last = index === length - 1;
      let newPos = 0;
      if (length >= showNum && !lastData) {
        newPos = this.getBarY(showNum - index);
      } else {
        newPos = this.getBarY(showNum - index - 1);
      }
      return {
        maxValue,
        width: bar.rectWidth,
        newWidth: bar.values[0] * this.rectMaxWidth / maxValue,
        pos: last ? 0 : bar.attr().y,
        newPos,
        opacity: !lastData && !index && length === showNum ? 0 : 1
      }
    })
  }
  onUpdate(barRank: BarRank, percent: number) {
    if (percent < 0.5) {
      this.bars.forEach((bar, index) => {
        const { width, newWidth } = this.animateData[index];
        bar.rectWidth = width + (newWidth - width) * percent * 2;
      })
      return;
    }
    this.bars.forEach((bar, index) => {
      const item = this.animateData[index];
      bar.attr({
        y: item.pos + (item.newPos - item.pos) * (percent - 0.5) * 2,
        opacity: 1 + (item.opacity - 1) * (percent - 0.5) * 2
      })
    })
  }
  afterAnimate(barRank: BarRank) {
    const { showNum, data } = barRank.config;
    const last = barRank.index === data.length - 1;
    if (this.bars.length >= showNum && !last) {
      const bar = this.bars.shift();
      bar.removeBy(this.group);
    }
  }
  async appendTo(layer: Layer) {
    await this.initRankLabel();
    layer.appendChild(this.group);
  }
  private getBarY(index: number) {
    return (this.barHeight + this.config.bar.alignSpacing) * Math.min(index, this.config.showNum - 1);
  }
}
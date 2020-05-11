import { Chart } from '../../common/chart';
import { DynamicAxis } from '../../common/axis/dynamic';
import { FixedAxis } from '../../common/axis/fixed';
import { LineRaceConfig } from './types';
import { lineRaceConfig } from './config';
import { deepmerge } from '../../common/util';
import { LineGroup } from './lineGroup';
import { parseData, sortValues } from '../../bar/race/util';

export class LineRace extends Chart {
  private index: number = 0;
  private yAxis: DynamicAxis;
  private xAxis: FixedAxis;
  private lineGroup: LineGroup;
  private maxValues: number[];
  config: LineRaceConfig;
  setConfig(config: LineRaceConfig) {
    config = deepmerge({}, lineRaceConfig, this.config || {}, config);
    super.setConfig(config);
    this.config.data = parseData(this.config.data, this.config.showNum);
    // 按第一个数据从大到小排序
    sortValues(this.config.data.data, 0, this.config.sortType);
    // 可能数据长度不足 showNum 的大小
    this.config.showNum = Math.min(this.config.showNum, this.config.data.data.length);
    this.initMaxValues();
  }
  private initMaxValues() {
    const { columnNames, data } = this.config.data;
    let values: number[] = columnNames.map((_, idx) => {
      const values = data.map(item => item.values[idx]);
      return Math.max(...values) / 0.9;
    })
    this.maxValues = values;
  }

  private renderYAxis(x: number, y: number, width: number, height: number) {
    this.yAxis = new DynamicAxis({
      type: 'row',
      x,
      y,
      width,
      height,
      ...this.config.yAxis,
    });
    this.yAxis.appendTo(this.layer);
  }
  private renderXAxis(x: number, y: number, width: number, height: number) {
    this.xAxis = new FixedAxis({
      type: 'column',
      x,
      y,
      width,
      height,
      ...this.config.xAxis,
    });
    this.xAxis.appendTo(this.layer);
  }
  async render() {
    await super.render();
    let [y, paddingRight, paddingBottom, x] = <number[]>this.config.padding;
    let width = this.config.width - x - paddingRight;
    let height = this.config.height - y - paddingBottom;
    const titleHeight = await this.renderTitle({
      ...this.config.title,
      x, y, width, height
    })
    y += titleHeight;
    height -= titleHeight;
    const subTitleHeight = await this.renderTitle({
      ...this.config.subTitle,
      x, y, width, height
    })
    y += subTitleHeight;
    height -= subTitleHeight;

    const yAxisLabelWidth = this.config.yAxis.label.width;
    const xAxisLabelHeight = this.config.xAxis.label.height;
    let yAxisY = y;
    if(this.config.xAxis.label.pos === 'top') {
      yAxisY = y + xAxisLabelHeight;
    }
    this.renderYAxis(x, yAxisY, width - 100, height - xAxisLabelHeight);

    this.renderXAxis(x + yAxisLabelWidth, y, width - yAxisLabelWidth - 100, height);
    this.xAxis.initTicks(this.config.data.columnNames);

    const lineGroup = new LineGroup({
      ...this.config,
      x: x + yAxisLabelWidth,
      y: yAxisY,
      width: width - yAxisLabelWidth - 100,
      height: height - xAxisLabelHeight
    })
    lineGroup.appendTo(this.layer);
    this.lineGroup = lineGroup;
  }
  async start() {
    await this.render();
    const length = this.config.data.columnNames.length;
    let { duration } = this.config;
    while (this.index < length) {
      this.emit('change', this.index);
      await this.beforeAnimate();
      const dur = typeof duration === 'function' ? duration(this.index, length) : duration;
      await this.timer.start(dur);
      await this.afterAnimate();
      this.index++;
    }
    this.emit('end');
  }
  private beforeAnimate() {
    const maxValue = this.maxValues[this.index]
    this.yAxis.beforeAnimate(maxValue);
    this.xAxis.beforeAnimate(this.index);
  }
  protected onUpdate(percent: number) {
    const { maxTick } = this.config.xAxis;
    const oldMaxValue = this.maxValues[Math.max(0, this.index - 1)];
    const maxValue = this.maxValues[this.index];
    this.yAxis.update(oldMaxValue, maxValue, percent);
    this.lineGroup.onUpdate(this.index, percent, maxTick, oldMaxValue, maxValue);
    this.xAxis.onUpdate(this.index, percent);
  }
  private afterAnimate() {
    this.yAxis.afterAnimate();
    this.lineGroup.afterAnimate();
    this.xAxis.afterAnimate(this.index);
  }
}
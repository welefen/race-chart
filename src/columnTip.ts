import { Group, Label } from 'spritejs';
import deepmerge from 'ts-deepmerge';

import { ColumnTipConfig } from './type';
import { splitValue, createLabel } from './util';

// 显示列和总数
export class ColumnTip {
  private config: ColumnTipConfig;
  private columnLabel: Label;
  private totalLabel: Label;
  private totalLabelHeight: number = 0;
  private group: Group;
  constructor(config: ColumnTipConfig) {
    this.config = deepmerge({}, config);
    const { x, y, width, height } = this.config;
    this.group = new Group({ x, y, width, height });
  }
  appendTo(group: Group) {
    group.appendChild(this.group);
    return this.initTotal().then(() => {
      return this.initColumn();
    })
  }
  get totalValue(): number {
    return this.config.barTotal.value;
  }
  setTotalText(value: number) {
    const barTotal = this.config.barTotal;
    if (barTotal.disabled) return Promise.resolve();
    barTotal.value = value;
    const { type, length } = this.config.valueSplit;
    const text = splitValue(value, type, length);
    this.totalLabel.attr({
      text: `${barTotal.prefix}${text}`
    })
    return this.totalLabel.textImageReady.then(() => {
      const [width, height] = this.totalLabel.clientSize;
      this.totalLabelHeight = height;
      this.totalLabel.attr({
        x: this.config.width - width - 20,
        y: this.config.height - height
      })
    })
  }
  private initTotal() {
    if (this.config.barTotal.disabled) return Promise.resolve();
    const barTotal = this.config.barTotal;
    const label = createLabel('', barTotal);
    this.totalLabel = label;
    this.group.appendChild(label);
    return this.setTotalText(barTotal.value || 0)
  }
  setColumnText(text: string) {
    this.columnLabel.attr({ text });
    return this.columnLabel.textImageReady.then(() => {
      const [width, height] = this.columnLabel.clientSize;
      this.columnLabel.attr({
        x: this.config.width - width - 20,
        y: this.config.height - height - (this.totalLabelHeight ? this.totalLabelHeight + 5 : 0)
      })
    })
  }
  private initColumn() {
    const { barColumn } = this.config;
    const label = createLabel('', barColumn);
    this.columnLabel = label;
    this.group.appendChild(label);
    return this.setColumnText(barColumn.text);
  }
  beforeAnimate(column: string) {
    this.setColumnText(column);
  }
  update(prevTotal: number, total: number, percent: number) {
    const value = Math.floor(prevTotal + (total - prevTotal) * percent);
    this.setTotalText(value);
  }
}
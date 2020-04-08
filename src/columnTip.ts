import { Group, Label } from 'spritejs';
import { defaultBarColumn, defaultBarTotal, BarColumnConfig, BarTotalConfig, BarConfig } from './config';
import deepmerge from 'ts-deepmerge';
import { spitValueWidthComma } from './util';

interface Config {
  width?: number;
  height?: number;
  barColumn?: BarColumnConfig;
  barTotal?: BarTotalConfig;
}

export class ColumnTip {
  private config: Config;
  private columnLabel: Label;
  private totalLabel: Label;
  private totalLabelHeight: number = 0;
  private group: Group;
  promise: Promise<any>;
  constructor(width: number, height: number, barColumnConfig?: BarColumnConfig, barTotalConfig?: BarTotalConfig) {
    this.config = deepmerge({}, {
      width,
      height,
      barColumn: defaultBarColumn,
      barTotal: defaultBarTotal
    }, {
      barColumn: barColumnConfig || {},
      barTotal: barTotalConfig || {}
    })
    this.group = new Group({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height
    })
    this.promise = this.initTotal().then(() => {
      this.initColumn();
    })
  }
  appendTo(group: Group) {
    group.appendChild(this.group);
  }
  get totalValue(): number {
    return this.config.barTotal.value;
  }
  setTotalText(value: number) {
    if (this.config.barTotal.disabled) return Promise.resolve();
    this.config.barTotal.value = value;
    const text = spitValueWidthComma(value, 3);
    this.totalLabel.attr({
      text: `${this.config.barTotal.prefix}${text}`
    })
    return this.totalLabel.textImageReady.then(() => {
      const [width, height] = this.totalLabel.clientSize;
      this.totalLabelHeight = height;
      this.totalLabel.attr({
        x: this.config.width - width - 30,
        y: this.config.height - height - 10
      })
    })
  }
  private initTotal() {
    if (this.config.barTotal.disabled) return Promise.resolve();
    const barTotal = this.config.barTotal;
    const label = new Label('');
    label.attr({
      font: `${barTotal.fontSize}px ${barTotal.fontFamily}`,
      fillColor: barTotal.color
    })
    this.totalLabel = label;
    this.group.appendChild(label);
    return this.setTotalText(barTotal.value)
  }
  setColumnText(text: string) {
    this.columnLabel.attr({ text })
    return this.columnLabel.textImageReady.then(() => {
      const [width, height] = this.columnLabel.clientSize;
      this.columnLabel.attr({
        x: this.config.width - width - 20,
        y: this.config.height - height - (this.totalLabelHeight ? this.totalLabelHeight + 5 : 0) - 10
      })
    })
  }
  private initColumn() {
    const barColumn = this.config.barColumn;
    const label = new Label('');
    label.attr({
      font: `${barColumn.fontSize}px ${barColumn.fontFamily}`,
      fontWeight: barColumn.fontWeight,
      fillColor: barColumn.color
    })
    this.columnLabel = label;
    this.group.appendChild(label);
    return this.setColumnText(barColumn.text);
  }
}
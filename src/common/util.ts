import merge from 'deepmerge';
import isMergeObject from 'is-mergeable-object';
import { Group, Label } from 'spritejs';
import { Position, Font } from './types';

export function deepmerge<T extends Record<string, any>>(...source: T[]): T {
  const data = merge.all(source, {
    arrayMerge: (_, sourceArray) => sourceArray,
    isMergeableObject(value) {
      if (value instanceof HTMLElement) {
        return false;
      }
      return isMergeObject(value);
    }
  });
  return <T>data;
}

export function valueFormatter(value: number, type: string): string {
  return Math.floor(value).toString().replace(/(?=(?!\b)(\d{3})+$)/g, ',');
}

export function parseCombineValue(value: number | number[]): number[] {
  if (!value) return [0, 0, 0, 0];
  if (!Array.isArray(value)) {
    value = [value, value, value, value];
  } else if (value.length === 1) {
    value = [value[0], value[0], value[0], value[0]];
  } else if (value.length === 2) {
    value = [value[0], value[1], value[0], value[1]];
  } else if (value.length === 3) {
    value[3] = value[1];
  }
  return value;
}

export function createLabel(text?: string, config?: Font): Label {
  const label = new Label(text || '');
  const { fontSize, fontStretch, fontFamily, fontWeight, fontStyle, fontVariant, lineHeight, color, opactiy, padding, align } = config;
  label.attr({
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    fontStretch,
    fontVariant,
    lineHeight,
    opactiy,
    fillColor: color,
    padding,
    textAlign: align,
    boxSizing: 'border-box'
  })
  return label;
}

export function createGroup(config?: Position): Group {
  const { x, y, width, height } = config;
  return new Group({ x, y, width, height });
}
import { config, fontFamily } from '../../common/config';
import { BarLogoConfig, BarTrendConfig, AxisConfig, BarConfig, BarLabelConfig, BarRectConfig, BarValueConfig, BarTotalConfig, BarColumnConfig } from './types';
import { valueFormatter } from '../../common/util';

const label: BarLabelConfig = {
  fontSize: 16,
  fontFamily,
  color: 'currentColor',
  width: 100
}

const logo: BarLogoConfig = {
  disabled: false,
}

const axis: AxisConfig = {
  maxTick: 4,
  color: '#666',
  lineColor: '#eee',
  fontSize: 12,
  fontFamily,
  tipHeight: 25
}

const rect: BarRectConfig = {
  minWidth: 0,
  width: 0,
  color: 'red',
  radius: 3,
  type: '2d',
  angle: 45,
  sideHeight: 10,
}

const value: BarValueConfig = {
  value: 0,
  fontSize: 14,
  fontFamily,
  color: 'currentColor',
  width: 100
}

const total: BarTotalConfig = {
  disabled: false,
  prefix: 'Total: ',
  fontSize: 22,
  fontFamily,
  color: '#aaa',
  align: 'right',
}

const column: BarColumnConfig = {
  text: '2011',
  fontSize: 78,
  color: '#bbb',
  fontFamily,
  fontWeight: 'bold',
  align: 'right'
}

const bar: BarConfig = {
  label,
  logo,
  rect,
  value,
  total,
  column,
  alignSpacing: 5,
  justifySpacing: 5,
}

export const barTrendConfig: BarTrendConfig = {
  ...config,
  axis,
  showNum: 10,
  scaleType: 'dynamic',
  sortType: 'desc',
  formatter: valueFormatter,
  bar,
  lastStayTime: 0,
  duration: 1000
}

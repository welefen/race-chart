import { config, fontFamily } from '../../common/config';
import { BarLogoConfig, BarTrendConfig, AxisConfig, BarConfig, BarLabelConfig, BarRectConfig, BarValueConfig, } from './types';
import { valueFormatter } from '../../common/util';

const label: BarLabelConfig = {
  fontSize: 16,
  fontFamily,
  color: 'currentColor',
  width: 100
}

const logo: BarLogoConfig = {
  disabled: false,
  deltaSize: 0,
  borderSize: 6
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



export const barConfig: BarConfig = {
  label,
  logo,
  rect,
  value,
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
  lastStayTime: 0,
  duration: 1000
}

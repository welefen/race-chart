import { chartConfig, fontFamily, axisConfig } from '../../common/config';
import { BarLogoConfig, BarChartConfig, BarConfig, BarLabelConfig, BarRectConfig, BarValueConfig, } from './types';
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

export const barChartConfig: BarChartConfig = {
  ...chartConfig,
  axis: axisConfig,
  showNum: 10,
  scaleType: 'dynamic',
  sortType: 'desc',
  formatter: valueFormatter,
  lastStayTime: 0,
  duration: 1000
}

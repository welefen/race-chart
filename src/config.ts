import { BarRaceConfig, Title, SubTitle, AxisConfig, BarColumnConfig, BarLabelConfig, BarRectConfig, BarValueConfig, BarTotalConfig, BarLogoConfig, WatermarkConfig } from './type';
import { formatter } from './util';

const fontFamily: string = '"宋体"';
const colors: string[] = ["#67b7dc", "#6794dc", "#6771dc", "#8067dc", "#a367dc", "#c767dc", "#dc67ce", "#dc67ab", "#dc6788", "#dc6967", "#dc8c67", "#dcaf67", "#dcd267", "#c3dc67", "#a0dc67", "#7ddc67", "#67dc75", "#67dc98", "#67dcbb", "#67dadc"];
colors.sort(_ => Math.random() > 0.5 ? 1 : -1);

const axis: AxisConfig = {
  maxTick: 4,
  color: '#666',
  lineColor: '#eee',
  fontSize: 12,
  fontFamily,
  tipHeight: 25
}

const barColumn: BarColumnConfig = {
  text: '2011',
  fontSize: 78,
  color: '#bbb',
  fontFamily,
  fontWeight: 'bold'
}

const barLabel: BarLabelConfig = {
  fontSize: 16,
  fontFamily,
  color: '#333',
  width: 100
}
const barRect: BarRectConfig = {
  minWidth: 0,
  width: 0,
  color: 'red',
  radius: 3,
  type: '2d',
  angle: 45,
  sideHeight: 10,
}

const barValue: BarValueConfig = {
  value: 0,
  fontSize: 14,
  fontFamily,
  color: '#333',
  width: 100
}

const title: Title = {
  fontSize: 30,
  fontFamily,
  color: '#444',
  align: 'center',
  lineHeight: 40,
};

const subTitle: SubTitle = {
  fontSize: 20,
  fontFamily,
  color: '#444',
  align: 'center',
  lineHeight: 30,
};

const barTotal: BarTotalConfig = {
  disabled: false,
  prefix: 'Total: ',
  fontSize: 22,
  fontFamily,
  color: '#aaa'
}

const barLogo: BarLogoConfig = {
  disabled: false,
  radius: 0
}

const watermark: WatermarkConfig = {
  fontSize: 16,
  fontFamily,
  color: '#ccc',
  rotate: -45,
}

export const defaultBarRace: BarRaceConfig = {
  width: 960,
  height: 540,
  displayRatio: 2,
  formatter,
  axis,
  title,
  subTitle,
  barLabel,
  barRect,
  barValue,
  barTotal,
  barColumn,
  barLogo,
  duration: 1000,
  alignSpacing: 5,
  justifySpacing: 5,
  scaleType: 'dynamic',
  sortType: 'desc',
  showNum: 10,
  colors,
  background: {},
  watermark,
  lastStayTime: 0,
  loop: false
}
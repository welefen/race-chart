import { ValueSplitConfig, BarRaceConfig, Title, SubTitle, AxisConfig, BarColumnConfig, BarLabelConfig, BarRectConfig, BarValueConfig, BarTotalConfig, BarLogoConfig, WatermarkConfig } from './type';

const valueSplit: ValueSplitConfig = {
  type: ',',
  length: 3
}
const fontFamily: string = '"宋体"';
const colors: string[] = [
  "#1D6996", "#EDAD08", "#73AF48", "#94346E", "#38A6A5", "#E17C05", "#5F4690",
  "#0F8554", "#6F4070", "#CC503E", "#994E95", "#11A579", "#F2B701", "#7F3C8D",
  "#80BA5A", "#E68310", "#CF1C90", "#008695", "#F97B72", "#4B4B8F", "#A5AA99",
  '#D98880', '#C39BD3', '#7FB3D5', '#76D7C4', '#7DCEA0', '#F7DC6F', '#F0B27A',
  '#D7DBDD', '#85929E', '#922B21', '#76448A', '#1F618D', '#148F77', '#1E8449',
  '#B7950B', '#AF601A', '#A04000', '#515A5A'
];


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
  minWidth: 10,
  width: 0,
  color: 'red',
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
  prefix: 'Total:',
  fontSize: 18,
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
  valueSplit,
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
  lastStayTime: 3000
}
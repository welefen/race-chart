import { barChartConfig, barConfig } from '../common/config';
import { BarRankConfig, RankConfig } from './types';
import { fontFamily } from '../../common/config';

const rank: RankConfig = {
  fontFamily,
  fontSize: 60,
  color: '#aaa',
  formatter(index) {
    return `第${index}名`;
  }
}

export const barRankConfig: BarRankConfig = {
  ...barChartConfig,
  delay: 300,
  bar: {
    ...barConfig,
    rank,
    percent: 0.7,
    maxValueIndex: 3
  }
}
import { LineRaceConfig } from "./types";
import { chartConfig, axisConfig, fontFamily } from '../../common/config';
import { deepmerge, valueFormatter } from '../../common/util';

export const lineRaceConfig: LineRaceConfig = {
  ...chartConfig,
  scoreType: 'score',
  line: {
    justifySpacing: 5,
    line: {
      width: 4,
      shadeWidth: 12,
      shadeOpacity: 0.2
    },
    circle: {
      radius: 20
    },
    label: {
      fontSize: 12,
      fontFamily,
      fontWeight: 'bold',
      width: 100,
    },
    value: {
      fontSize: 12,
      fontFamily,
      pos: 'outside',
      formatter: valueFormatter
    }
  },
  yAxis: axisConfig,
  xAxis: deepmerge(axisConfig, {
    label: {
      pos: 'top'
    }
  }),
}
import { LineRaceConfig } from "./types";
import { chartConfig, axisConfig } from '../../common/config';
import { deepmerge } from '../../common/util';

export const lineRaceConfig: LineRaceConfig = {
  ...chartConfig,
  yAxis: axisConfig,
  xAxis: deepmerge(axisConfig, {
    label: {
      pos: 'bottom'
    }
  }),
}
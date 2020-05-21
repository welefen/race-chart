import { CloudConfig } from './types';
import { chartConfig, fontFamily } from '../../common/config';

export const cloudConfig: CloudConfig = {
  ...chartConfig,
  mask: {
    fontFamily,
    fontSize: 30
  },
  gridSize: 8,
  weightFactor: 1,
  minFontSize: 1,
  maxFontSize: 300,
  textStyle: {},
  debug: true,
  autoShrink: true,
  shrinkPercent: 0.75,
  shufflePoints: true,
  rotate: {
    disabled: false,
    min: 0,
    max: 360,
    step: 18
  }
};
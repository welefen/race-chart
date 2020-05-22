import { CloudConfig } from './types';
import { chartConfig, fontFamily } from '../../common/config';

export const cloudConfig: CloudConfig = {
  ...chartConfig,
  mask: {
    fontFamily,
    fontSize: 50
  },
  gridSize: 8,
  weightFactor: 1,
  minFontSize: 10,
  maxFontSize: 300,
  textStyle: {},
  debug: false,
  delay: 100,
  autoShrink: true,
  shrinkPercent: 0.9,
  shufflePoints: true,
  rotate: {
    disabled: false,
    min: -90,
    max: 90,
    step: 45
  }
};
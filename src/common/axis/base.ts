import { AxisConfig } from "../types";
import { Layer, Group } from 'spritejs';
import { createGroup } from "../util";

export class AxisBase {
  private config: AxisConfig;
  private group: Group;
  constructor(config: AxisConfig) {
    this.config = config;
    this.group = createGroup(config);
  }
  appendTo(layer: Layer) {
    layer.appendChild(this.group);
  }
}
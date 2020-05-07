import { Group, Polyline } from 'spritejs';
import { LineNodeConfig } from './types';
import { createGroup } from '../../common/util';
export class LineNode {
  private group: Group;
  private config: LineNodeConfig;
  private lines: Polyline[];
  public values: number[];
  constructor(config: LineNodeConfig, values: number[]) {
    this.config = config;
    this.group = createGroup(config);
    this.values = values;
  }
  private initLines() {
    let points = [];
    const line = new Polyline({
      points,
      close: false,
      strokeColor: this.config.color,
      lineWidth: 12,
      lineCap: 'square',
      opacity: 0.2,
      smooth: false
    });
    this.group.appendChild(line);
    const line2 = new Polyline({
      points,
      close: false,
      strokeColor: this.config.color,
      lineWidth: 4,
      lineCap: 'square',
      smooth: false
    });
    this.group.appendChild(line2);
    this.lines = [line, line2];
  }
  update(points: number[], value: number) {
    this.lines.forEach(line => {
      line.attr({ points })
    })
  }
  appendTo(parent: Group) {
    parent.appendChild(this.group);
    this.initLines();
  }
}
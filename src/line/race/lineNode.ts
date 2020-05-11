import { Group, Polyline, Block, Label } from 'spritejs';
import { LineNodeConfig } from './types';
import { createGroup, createLabel } from '../../common/util';
export class LineNode {
  private group: Group;
  private config: LineNodeConfig;
  private lines: Polyline[];
  private circle: Block;
  private label: Label;
  private labelSize: number[] = [0, 0];
  private value: Label;
  public values: number[];
  constructor(config: LineNodeConfig, values: number[]) {
    this.config = config;
    this.group = createGroup(config);
    this.values = values;
  }
  private initLine() {
    const { color, shadeOpacity, shadeWidth, width } = this.config.line;
    let points = [];
    const line = new Polyline({
      points,
      close: false,
      strokeColor: color,
      lineWidth: shadeWidth,
      lineCap: 'square',
      opacity: shadeOpacity,
      smooth: false
    });
    this.group.appendChild(line);
    const line2 = new Polyline({
      points,
      close: false,
      strokeColor: color,
      lineWidth: width,
      lineCap: 'square',
      smooth: false
    });
    this.group.appendChild(line2);
    this.lines = [line, line2];
    const { radius } = this.config.circle;
    const circle = new Block({
      bgcolor: color,
      width: radius,
      height: radius,
      borderRadius: radius,
      opacity: 0
    })
    this.group.appendChild(circle);
    this.circle = circle;

    const { label } = this.config;
    const labelNode = createLabel(label.text, label);
    labelNode.attr({ fillColor: color, opacity: 0 });
    labelNode.textImageReady.then(() => {
      this.labelSize = labelNode.clientSize;
    })
    this.group.appendChild(labelNode);
    this.label = labelNode;

    // 数字
    const { value } = this.config;
    const valueNode = createLabel('', value);
    valueNode.attr({ fillColor: color, opacity: 0 });
    this.group.appendChild(valueNode);
    this.value = valueNode;
  }
  update(points: number[], value: number) {
    this.lines.forEach(line => {
      line.attr({ points })
    })
    if (points.length) {
      const { radius } = this.config.circle;
      const length = points.length;
      this.circle.attr({
        opacity: 1,
        x: points[length - 2] - radius / 2,
        y: points[length - 1] - radius / 2
      })
      this.label.attr({
        opacity: 1,
        x: points[length - 2] + radius / 2 + this.config.justifySpacing,
        y: points[length - 1] - this.labelSize[1] / 2
      })
      const text = this.config.value.formatter(value, 'value');
      // this.value.attr({
      //   text,
      //   opacity: 1,
      //   x: points[length - 2] + radius / 2 + this.config.justifySpacing * 2 + this.labelSize[0],
      //   y: points[length - 1] - this.labelSize[1] / 2
      // })
    }
  }
  appendTo(parent: Group) {
    parent.appendChild(this.group);
    this.initLine();
  }
}
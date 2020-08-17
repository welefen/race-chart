import { Group } from 'spritejs';
import { LineNodeConfig } from './types';
export declare class LineNode {
    private group;
    private config;
    private lines;
    private labelGroup;
    private labelValue;
    values: number[];
    constructor(config: LineNodeConfig, values: number[]);
    private initLine;
    update(points: number[], value: number): void;
    appendTo(parent: Group): void;
}

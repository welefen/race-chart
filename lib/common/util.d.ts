import { Group, Label } from 'spritejs';
import { Position, Font } from './types';
export declare function deepmerge<T extends Record<string, any>>(...source: T[]): T;
export declare function valueFormatter(value: number, type: string): string;
export declare function parseCombineValue(value: number | number[]): number[];
export declare function createLabel(text?: string, config?: Font): Label;
export declare function createGroup(config?: Position): Group;
export declare function timeout(time: number): Promise<void>;

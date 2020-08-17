import { Chart } from '../../common/chart';
import { CloudConfig, CloudItemInfo } from './types';
import { Position } from '../../common/types';
export declare class Cloud extends Chart {
    protected maxRadius: number;
    protected center: number[];
    protected maskPos: Position;
    protected grid: boolean[][];
    protected pointsAtRadius: number[][][];
    config: CloudConfig;
    setConfig(config: CloudConfig): void;
    private parseData;
    protected drawGridItems(grid: boolean[][], color?: string): void;
    render(): Promise<void>;
    private updatePosition;
    private getImageMaskData;
    private drawMaskImage;
    private getImageData;
    protected parseMaskGrid(pos: Position): Promise<boolean[][]>;
    private getGridItemStatus;
    protected parseGridData(imageData: ImageData, flag?: boolean, gridSize?: number): boolean[][];
    protected getImageOccupied(imageData: ImageData, gridSize?: number): any[];
    private drawPoints;
    protected getPointsAtRadius(radius: number, center: number[]): number[][];
    protected tryToPutAtPoint(point: number[], item: CloudItemInfo): boolean;
    protected getRotateDeg(): number;
}

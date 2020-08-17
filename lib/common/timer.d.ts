declare type UPDATE_CALLBACK = (percent: number) => void;
export declare class Timer {
    private duration;
    private timerData;
    private update;
    private tween;
    constructor(duration: number, update: UPDATE_CALLBACK);
    start(duration?: number, update?: UPDATE_CALLBACK): Promise<unknown>;
    stop(): void;
}
export {};

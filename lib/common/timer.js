"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tween_js_1 = __importDefault(require("@tweenjs/tween.js"));
function animate() {
    requestAnimationFrame(animate);
    tween_js_1.default.update();
}
requestAnimationFrame(animate);
class Timer {
    constructor(duration, update) {
        this.duration = duration;
        this.update = update;
    }
    start(duration, update) {
        duration = duration || this.duration;
        update = update || this.update;
        this.timerData = { time: 0 };
        this.tween = new tween_js_1.default.Tween(this.timerData).to({
            time: duration
        }, duration).easing(tween_js_1.default.Easing.Linear.None).onUpdate(() => {
            const percent = this.timerData.time / duration;
            update(percent);
        });
        return new Promise(resolve => {
            this.tween.onComplete(() => {
                resolve();
            });
            this.tween.start();
        });
    }
    stop() {
        if (this.tween) {
            this.tween.stop();
        }
    }
}
exports.Timer = Timer;

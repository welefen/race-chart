"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const is_mergeable_object_1 = __importDefault(require("is-mergeable-object"));
const spritejs_1 = require("spritejs");
function deepmerge(...source) {
    const data = deepmerge_1.default.all(source, {
        arrayMerge: (_, sourceArray) => sourceArray,
        isMergeableObject(value) {
            if (value instanceof HTMLElement) {
                return false;
            }
            return is_mergeable_object_1.default(value);
        }
    });
    return data;
}
exports.deepmerge = deepmerge;
function valueFormatter(value, type) {
    const str = value.toString();
    let fract = '';
    if (str.indexOf('.') > -1) {
        fract = `${str.slice(str.indexOf('.'))}`;
    }
    return Math.floor(value).toString().replace(/(?=(?!\b)(\d{3})+$)/g, ',') + fract;
}
exports.valueFormatter = valueFormatter;
function parseCombineValue(value) {
    if (!value)
        return [0, 0, 0, 0];
    if (!Array.isArray(value)) {
        value = [value, value, value, value];
    }
    else if (value.length === 1) {
        value = [value[0], value[0], value[0], value[0]];
    }
    else if (value.length === 2) {
        value = [value[0], value[1], value[0], value[1]];
    }
    else if (value.length === 3) {
        value[3] = value[1];
    }
    return value;
}
exports.parseCombineValue = parseCombineValue;
function createLabel(text, config) {
    const label = new spritejs_1.Label(text || '');
    const { fontSize, fontStretch, fontFamily, fontWeight, fontStyle, fontVariant, lineHeight, color, opactiy, padding, align, rotate } = config;
    label.attr({
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        fontStretch,
        fontVariant,
        lineHeight,
        opactiy,
        fillColor: color,
        padding,
        textAlign: align,
        boxSizing: 'border-box',
        rotate
    });
    return label;
}
exports.createLabel = createLabel;
function createGroup(config) {
    const { x, y, width, height } = config;
    return new spritejs_1.Group({ x, y, width, height });
}
exports.createGroup = createGroup;
function timeout(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
exports.timeout = timeout;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.randomInt = void 0;
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomInt = randomInt;
const Range = (start, end) => {
    return Array.from({ length: (end - start) }, (v, k) => k + start);
};
exports.Range = Range;

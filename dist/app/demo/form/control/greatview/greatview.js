"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.computed = exports.data = void 0;
exports.data = {
    'lineValue': 100,
    'lineCount': 2,
    'sLeft1': 0,
    'sTop1': 0,
    'l1': 0,
    'c1': 0,
    'sLeft2': 0,
    'sTop2': 0,
    'l2': 0,
    'c2': 0,
    'sLeft3': 0,
    'sTop3': 0,
    'l3': 0,
    'c3': 0,
    'sLeft4': 0,
    'sTop4': 0,
    'l4': 0,
    'c4': 0,
    'direction': false,
    'dir5': 'v',
    'sLeft5': 0,
    'sTop5': 0,
    'l5': 0,
    'c5': 0,
    'line5': 10,
    'c6': 0,
    'is6': [],
    'gesture': false,
    'style': false,
    'selection': false,
    'area': {}
};
exports.computed = {
    'is': function () {
        let is = [];
        for (let i = 0; i < this.lineCount; ++i) {
            if (i > 0 && i % 10 === 0) {
                is[i] = 30;
                continue;
            }
        }
        return is;
    }
};
let mounted = function () {
    this.is6[29] = 50;
    this.is6[39] = 50;
};
exports.mounted = mounted;

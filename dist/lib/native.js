"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.size = exports.restore = exports.min = exports.max = exports.invoke = exports.getToken = void 0;
const clickgo = require("../clickgo");
const token = (Math.random() * 100000000000000 * (100 + Math.round(Math.random() * (999 - 100)))).toString(32);
function getToken() {
    return token;
}
exports.getToken = getToken;
function invoke(name, ...param) {
    if (!clickgo.isNative()) {
        return;
    }
    return window.clickgoNative.invoke(name, ...param);
}
exports.invoke = invoke;
function max() {
    invoke('cg-set-state', token, 'max');
}
exports.max = max;
function min() {
    invoke('cg-set-state', token, 'min');
}
exports.min = min;
function restore() {
    invoke('cg-set-state', token, 'restore');
}
exports.restore = restore;
function size(width, height) {
    invoke('cg-set-size', token, width, height);
}
exports.size = size;

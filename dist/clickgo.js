"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = exports.tool = exports.theme = exports.task = exports.native = exports.fs = exports.form = exports.dom = exports.core = exports.control = exports.vue = exports.hasFrame = exports.isImmersion = exports.getPlatform = exports.isNative = exports.getVersion = void 0;
const version = '3.1.3';
function getVersion() {
    return version;
}
exports.getVersion = getVersion;
const native = navigator.userAgent.includes('electron') ? true : false;
function isNative() {
    return native;
}
exports.isNative = isNative;
let platform = 'web';
let immersion = false;
let frame = false;
if (native) {
    const reg = /electron\/(.+?) (.+?)\/(.+?) immersion\/([0-9]) frame\/([0-9])/.exec(navigator.userAgent);
    if (reg) {
        platform = reg[2];
        immersion = reg[4] === '0' ? false : true;
        frame = reg[5] === '0' ? false : true;
    }
}
function getPlatform() {
    return platform;
}
exports.getPlatform = getPlatform;
function isImmersion() {
    return immersion;
}
exports.isImmersion = isImmersion;
function hasFrame() {
    return frame;
}
exports.hasFrame = hasFrame;
exports.vue = window.Vue;
exports.control = require("./lib/control");
exports.core = require("./lib/core");
exports.dom = require("./lib/dom");
exports.form = require("./lib/form");
exports.fs = require("./lib/fs");
exports.native = require("./lib/native");
exports.task = require("./lib/task");
exports.theme = require("./lib/theme");
exports.tool = require("./lib/tool");
exports.zip = require("./lib/zip");

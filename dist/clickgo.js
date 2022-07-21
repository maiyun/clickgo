"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = exports.tool = exports.theme = exports.task = exports.native = exports.fs = exports.form = exports.dom = exports.core = exports.control = exports.vue = exports.getSafe = exports.setSafe = exports.getPlatform = exports.getNative = exports.getVersion = void 0;
const version = '3.0.0';
function getVersion() {
    return version;
}
exports.getVersion = getVersion;
const native = navigator.userAgent.includes('electron') ? true : false;
function getNative() {
    return native;
}
exports.getNative = getNative;
let platform = 'web';
if (native) {
    const reg = /electron\/(.+?) (.+?)\//.exec(navigator.userAgent);
    if (reg) {
        platform = reg[2];
    }
}
function getPlatform() {
    return platform;
}
exports.getPlatform = getPlatform;
let safe = true;
function setSafe(val) {
    safe = val;
}
exports.setSafe = setSafe;
function getSafe() {
    return safe;
}
exports.getSafe = getSafe;
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

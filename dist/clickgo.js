"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = exports.tool = exports.theme = exports.task = exports.storage = exports.native = exports.fs = exports.form = exports.dom = exports.core = exports.control = exports.vue = void 0;
exports.getVersion = getVersion;
exports.isNative = isNative;
exports.getPlatform = getPlatform;
exports.isImmersion = isImmersion;
exports.hasFrame = hasFrame;
const version = '3.16.20';
function getVersion() {
    return version;
}
const native = navigator.userAgent.includes('electron') ? true : false;
function isNative() {
    return native;
}
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
function isImmersion() {
    return immersion;
}
function hasFrame() {
    return frame;
}
exports.vue = window.Vue;
exports.control = __importStar(require("./lib/control"));
exports.core = __importStar(require("./lib/core"));
exports.dom = __importStar(require("./lib/dom"));
exports.form = __importStar(require("./lib/form"));
exports.fs = __importStar(require("./lib/fs"));
exports.native = __importStar(require("./lib/native"));
exports.storage = __importStar(require("./lib/storage"));
exports.task = __importStar(require("./lib/task"));
exports.theme = __importStar(require("./lib/theme"));
exports.tool = __importStar(require("./lib/tool"));
exports.zip = __importStar(require("./lib/zip"));

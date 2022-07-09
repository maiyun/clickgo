"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.getCdn = exports.setCdn = exports.getSafe = exports.setSafe = exports.getNative = exports.getVersion = exports.vue = exports.zip = exports.tool = exports.theme = exports.task = exports.native = exports.fs = exports.form = exports.dom = exports.core = exports.control = exports.clickgo = void 0;
function getVersion() {
    return exports.clickgo.getVersion();
}
exports.getVersion = getVersion;
function getNative() {
    return exports.clickgo.getNative();
}
exports.getNative = getNative;
function setSafe(val) {
    exports.clickgo.setSafe(val);
}
exports.setSafe = setSafe;
function getSafe() {
    return exports.clickgo.getSafe();
}
exports.getSafe = getSafe;
function setCdn(val) {
    exports.clickgo.setCdn(val);
}
exports.setCdn = setCdn;
function getCdn() {
    return exports.clickgo.getCdn();
}
exports.getCdn = getCdn;
function init(cdn = 'https://cdn.jsdelivr.net') {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const paths = [
            cdn + '/npm/vue@3.2.31/dist/vue.global.min.js'
        ];
        let ro = true;
        if (!(window.ResizeObserver)) {
            ro = false;
            paths.push(cdn + '/npm/@juggle/resize-observer@3.3.1/lib/exports/resize-observer.umd.min.js');
        }
        yield loader.loadScripts(paths);
        if (!ro) {
            window.ResizeObserverEntry = window.ResizeObserver.ResizeObserverEntry;
            window.ResizeObserver = window.ResizeObserver.ResizeObserver;
        }
        const map = {
            'jszip': cdn + '/npm/jszip@3.10.0/dist/jszip.min'
        };
        const after = '?' + Math.random().toString();
        const files = yield loader.sniffFiles('clickgo.js', {
            'dir': __dirname + '/',
            'after': after,
            'afterIgnore': new RegExp('^' + cdn.replace(/\./g, '\\.')),
            'map': map
        });
        const cg = loader.require('clickgo', files, {
            'dir': __dirname + '/',
            'map': map
        })[0];
        cg.setCdn(cdn);
        try {
            const style = yield (yield fetch(__dirname + '/global.css' + (!__dirname.startsWith(cdn) ? after : ''))).text();
            (_a = document.getElementById('cg-global')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('afterbegin', style);
        }
        catch (_b) {
            alert(`ClickGo: "${__dirname}/global.css'" failed.`);
        }
        exports.clickgo = cg;
        exports.control = cg.control;
        exports.core = cg.core;
        exports.dom = cg.dom;
        exports.form = cg.form;
        exports.fs = cg.fs;
        exports.native = cg.native;
        exports.task = cg.task;
        exports.theme = cg.theme;
        exports.tool = cg.tool;
        exports.zip = cg.zip;
    });
}
exports.init = init;

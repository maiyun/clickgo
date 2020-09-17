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
let tmpCgRootPath = '';
(function () {
    let temp = document.querySelectorAll('head > script');
    let scriptEle = temp[temp.length - 1];
    tmpCgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf('/') + 1);
})();
let tmpZoom = 1;
if (window.devicePixelRatio < 2) {
    tmpZoom = 1 / window.devicePixelRatio;
}
const clickgo = {
    'rootPath': window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1),
    'cgRootPath': tmpCgRootPath,
    'hasTouch': ('ontouchstart' in document.documentElement) ? true : false,
    'isNative': navigator.userAgent.toLowerCase().indexOf('electron') === -1 ? false : true,
    'zoom': tmpZoom,
    'rzoom': 1 / tmpZoom,
    'position': {
        'left': null,
        'top': null,
        'width': null,
        'height': null,
        'offsetWidth': null,
        'offsetHeight': null
    },
    getPosition: function () {
        var _a, _b, _c, _d, _e, _f;
        return {
            'left': (_a = this.position.left) !== null && _a !== void 0 ? _a : 0,
            'top': (_b = this.position.top) !== null && _b !== void 0 ? _b : 0,
            'width': window.innerWidth * this.rzoom + ((_c = this.position.offsetWidth) !== null && _c !== void 0 ? _c : 0),
            'height': window.innerHeight * this.rzoom + ((_d = this.position.offsetHeight) !== null && _d !== void 0 ? _d : 0),
            'offsetWidth': (_e = this.position.offsetWidth) !== null && _e !== void 0 ? _e : 0,
            'offsetHeight': (_f = this.position.offsetHeight) !== null && _f !== void 0 ? _f : 0
        };
    },
    'isReady': false,
    'readys': [],
    ready: function (callback) {
        if (this.isReady) {
            const rtn = callback();
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
        }
        else {
            this.readys.push(callback);
        }
    },
    'core': {},
    'element': {},
    'form': {},
    'theme': {},
    'tool': {}
};
let tmpScript = document.createElement('script');
tmpScript.src = 'https://cdn.jsdelivr.net/npm/@litert/loader@1.1.0/dist/index.min.js';
tmpScript.addEventListener('load', function () {
    loader.ready(() => __awaiter(this, void 0, void 0, function* () {
        var _a;
        loader.setAfter('?' + Math.random());
        let paths = [
            'https://cdn.jsdelivr.net/npm/vue@3.0.0-rc.12/dist/vue.global.min.js'
        ];
        let ro = true;
        if (!(window.ResizeObserver)) {
            ro = false;
            paths.push('https://cdn.jsdelivr.net/npm/@juggle/resize-observer@3.2.0/lib/exports/resize-observer.umd.min.js');
        }
        for (let path of paths) {
            if (!(yield loader.loadScript(document.getElementsByTagName('head')[0], path))) {
                alert('Librarys load failed.');
                return;
            }
        }
        if (!ro) {
            window.ResizeObserverEntry = window.ResizeObserver.ResizeObserverEntry;
            window.ResizeObserver = window.ResizeObserver.ResizeObserver;
        }
        let [cg] = (_a = yield loader.require(clickgo.cgRootPath + 'clickgo')) !== null && _a !== void 0 ? _a : [];
        if (!clickgo) {
            alert('Clickgo load failed.');
            return;
        }
        clickgo.core = cg.core;
        clickgo.element = cg.element;
        clickgo.form = cg.form;
        clickgo.theme = cg.theme;
        clickgo.tool = cg.tool;
        clickgo.isReady = true;
        for (let func of clickgo.readys) {
            const rtn = func();
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
        }
    }));
});
document.getElementsByTagName('head')[0].insertAdjacentElement('afterend', tmpScript);
document.addEventListener('touchstart', function () {
    return;
});

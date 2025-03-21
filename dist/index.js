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
exports.AbstractBoot = exports.vue = exports.zip = exports.tool = exports.theme = exports.task = exports.storage = exports.native = exports.fs = exports.form = exports.dom = exports.core = exports.control = exports.clickgo = void 0;
exports.getVersion = getVersion;
exports.isNative = isNative;
exports.getPlatform = getPlatform;
exports.isImmersion = isImmersion;
exports.hasFrame = hasFrame;
exports.launcher = launcher;
function getVersion() {
    return exports.clickgo.getVersion();
}
function isNative() {
    return exports.clickgo.isNative();
}
function getPlatform() {
    return exports.clickgo.getPlatform();
}
function isImmersion() {
    return exports.clickgo.isImmersion();
}
function hasFrame() {
    return exports.clickgo.hasFrame();
}
class AbstractBoot {
    isDebug() {
        return this._debug;
    }
    constructor(opt = {}) {
        this._debug = false;
        if (opt.debug) {
            this._debug = true;
        }
    }
    onError() {
        return;
    }
    onScreenResize() {
        return;
    }
    onConfigChanged() {
        return;
    }
    onFormCreated() {
        return;
    }
    onFormRemoved() {
        return;
    }
    onFormTitleChanged() {
        return;
    }
    onFormIconChanged() {
        return;
    }
    onFormStateMinChanged() {
        return;
    }
    onFormStateMaxChanged() {
        return;
    }
    onFormShowChanged() {
        return;
    }
    onFormFocused() {
        return;
    }
    onFormBlurred() {
        return;
    }
    onFormFlash() {
        return;
    }
    onFormShowInSystemTaskChange() {
        return;
    }
    onFormHashChange() {
        return;
    }
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
    onHashChanged() {
        return;
    }
    onKeydown() {
        return;
    }
    onKeyup() {
        return;
    }
    onRuntimeFileLoad() {
        return;
    }
    onRuntimeFileLoaded() {
        return;
    }
}
exports.AbstractBoot = AbstractBoot;
function launcher(boot) {
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const paths = [
                `${loader.cdn}/npm/vue@3.5.13/dist/vue.global${boot.isDebug() ? '' : '.prod.min'}.js`
            ];
            if (!(window.TouchEvent)) {
                window.TouchEvent = CustomEvent;
            }
            let ro = true;
            if (!(window.ResizeObserver)) {
                ro = false;
                paths.push(loader.cdn + '/npm/@juggle/resize-observer@3.4.0/lib/exports/resize-observer.umd.min.js');
            }
            yield loader.loadScripts(paths);
            if (!ro) {
                window.ResizeObserverEntry = window.ResizeObserver.ResizeObserverEntry;
                window.ResizeObserver = window.ResizeObserver.ResizeObserver;
            }
            const map = {
                'jszip': loader.cdn + '/npm/jszip@3.10.1/dist/jszip.min'
            };
            const after = '?' + Math.random().toString();
            const files = yield loader.sniffFiles('clickgo.js', {
                'dir': __dirname + '/',
                'after': after,
                'map': map,
                'load': (url) => {
                    boot.onRuntimeFileLoad(url);
                },
                'loaded': (url, state) => {
                    boot.onRuntimeFileLoaded(url, state);
                }
            });
            const cg = loader.require('clickgo', files, {
                'dir': __dirname + '/',
                'map': map
            })[0];
            try {
                let style = yield (yield fetch(__dirname + '/global.css' + (__dirname.startsWith(loader.cdn) ? '' : '?' + Math.random().toString()))).text();
                const reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
                let match = null;
                while ((match = reg.exec(style))) {
                    style = style.replace(match[0], `url('${__dirname}/${match[1]}')`);
                }
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
            exports.core.boot = boot;
            yield boot.main();
        });
    })().catch(function (e) {
        console.log('launcher', e);
    });
}

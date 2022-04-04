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
const clickgo = {
    'version': '3.0.0',
    'safe': true,
    'rootPath': window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1),
    'cgRootPath': '',
    'cdnPath': 'https://cdn.jsdelivr.net',
    'native': navigator.userAgent.toLowerCase().includes('electron') ? true : false,
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
    'control': {},
    'core': {},
    'dom': {},
    'form': {},
    'task': {},
    'theme': {},
    'tool': {},
    'zip': {}
};
(function () {
    const temp = document.querySelectorAll('script');
    const scriptEle = temp[temp.length - 1];
    clickgo.cgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf('/') + 1);
    const lio = scriptEle.src.lastIndexOf('?');
    if (lio !== -1) {
        const match = /[?&]cdn=(.+?)($|&)/.exec(scriptEle.src.slice(lio));
        if (match) {
            clickgo.cdnPath = match[1];
        }
    }
    const tmpScript = document.createElement('script');
    tmpScript.src = clickgo.cdnPath + '/npm/@litert/loader@3.0.5/dist/loader.min.js';
    tmpScript.addEventListener('load', function () {
        loader.ready(() => __awaiter(this, void 0, void 0, function* () {
            const paths = [
                clickgo.cdnPath + '/npm/vue@3.2.31/dist/vue.global.min.js'
            ];
            let ro = true;
            if (!(window.ResizeObserver)) {
                ro = false;
                paths.push(clickgo.cdnPath + '/npm/@juggle/resize-observer@3.3.1/lib/exports/resize-observer.umd.min.js');
            }
            yield loader.loadScripts(paths);
            if (!ro) {
                window.ResizeObserverEntry = window.ResizeObserver.ResizeObserverEntry;
                window.ResizeObserver = window.ResizeObserver.ResizeObserver;
            }
            const map = {
                'jszip': clickgo.cdnPath + '/npm/jszip@3.8.0/dist/jszip.min'
            };
            const files = yield loader.sniffFiles('clickgo.js', {
                'dir': clickgo.cgRootPath,
                'after': '?' + Math.random().toString(),
                'map': map
            });
            const cg = loader.require('clickgo', files, {
                'dir': clickgo.cgRootPath,
                'map': map
            })[0];
            if (!cg) {
                alert('Clickgo load failed.');
                return;
            }
            clickgo.control = cg.control;
            clickgo.core = cg.core;
            clickgo.dom = cg.dom;
            clickgo.form = cg.form;
            clickgo.task = cg.task;
            clickgo.theme = cg.theme;
            clickgo.tool = cg.tool;
            clickgo.zip = cg.zip;
            clickgo.isReady = true;
            for (const func of clickgo.readys) {
                const r = func();
                if (r instanceof Promise) {
                    r.catch(function (e) {
                        console.log(e);
                    });
                }
            }
        }));
    });
    document.getElementsByTagName('head')[0].insertAdjacentElement('afterend', tmpScript);
})();

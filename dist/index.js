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
    'rootPath': window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1),
    'cgRootPath': '',
    'isNative': navigator.userAgent.toLowerCase().includes('electron') ? true : false,
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
    let temp = document.querySelectorAll('script');
    let scriptEle = temp[temp.length - 1];
    clickgo.cgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf('/') + 1);
    let tmpScript = document.createElement('script');
    tmpScript.src = 'https://cdn.jsdelivr.net/npm/@litert/loader@2.1.4-rc5/dist/index.min.js';
    tmpScript.addEventListener('load', function () {
        loader.ready(() => __awaiter(this, void 0, void 0, function* () {
            let paths = [
                'https://cdn.jsdelivr.net/npm/vue@3.1.4/dist/vue.global.min.js',
                'https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js'
            ];
            let ro = true;
            if (!(window.ResizeObserver)) {
                ro = false;
                paths.push('https://cdn.jsdelivr.net/npm/@juggle/resize-observer@3.3.0/lib/exports/resize-observer.umd.min.js');
            }
            yield loader.loadScripts(document.getElementsByTagName('head')[0], paths);
            if (!ro) {
                window.ResizeObserverEntry = window.ResizeObserver.ResizeObserverEntry;
                window.ResizeObserver = window.ResizeObserver.ResizeObserver;
            }
            let files = yield loader.sniffFiles('clickgo.js', {
                'dir': clickgo.cgRootPath,
                'after': '?' + Math.random().toString()
            });
            let cg = loader.require('clickgo', files, {
                'dir': clickgo.cgRootPath
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
            for (let func of clickgo.readys) {
                func();
            }
        }));
    });
    document.getElementsByTagName('head')[0].insertAdjacentElement('afterend', tmpScript);
})();

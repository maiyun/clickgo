/**
 * Copyright 2021 Han Guoshuai <zohegs@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** --- ClickGo 对象 --- */
const clickgo: IClickGo = {
    'rootPath': window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1),
    'cgRootPath': '',
    'isNative': navigator.userAgent.toLowerCase().includes('electron') ? true : false,

    'isReady': false,
    'readys': [],
    ready: function(callback: () => void | Promise<void>): void {
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

    'control': {} as ICGControlLib,
    'core': {} as ICGCoreLib,
    'dom': {} as ICGDomLib,
    'form': {} as ICGFormLib,
    'task': {} as ICGTaskLib,
    'theme': {} as ICGThemeLib,
    'tool': {} as ICGToolLib,
    'zip': {} as ICGZipLib
};

/** --- 获取当前 cg index 的基路径 --- */
(function() {
    let temp = document.querySelectorAll('script');
    let scriptEle = temp[temp.length - 1];
    clickgo.cgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf('/') + 1);

    // --- 加载 loader ---
    let tmpScript = document.createElement('script');
    tmpScript.src = 'https://cdn.jsdelivr.net/npm/@litert/loader@2.1.4-rc5/dist/index.min.js';
    tmpScript.addEventListener('load', function(): void {
        loader.ready(async () => {
            // --- 通过标签加载库 ---
            let paths: string[] = [
                'https://cdn.jsdelivr.net/npm/vue@3.1.4/dist/vue.global.min.js',
                'https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js'
            ];
            // --- 判断 ResizeObserver 是否存在 ---
            let ro = true;
            // ResizeObserver = undefined;
            if (!((window as any).ResizeObserver)) {
                ro = false;
                paths.push('https://cdn.jsdelivr.net/npm/@juggle/resize-observer@3.3.0/lib/exports/resize-observer.umd.min.js');
            }
            // --- 加载 vue 以及必要库 ---
            await loader.loadScripts(document.getElementsByTagName('head')[0], paths);
            // --- 处理 ResizeObserver ---
            if (!ro) {
                (window as any).ResizeObserverEntry = (window as any).ResizeObserver.ResizeObserverEntry;
                (window as any).ResizeObserver = (window as any).ResizeObserver.ResizeObserver;
            }
            // --- 加载 clickgo 主程序 ---
            let files = await loader.sniffFiles('clickgo.js', {
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
            // --- 执行 ready ---
            clickgo.isReady = true;
            for (let func of clickgo.readys) {
                func() as void;
            }
        });
    });
    document.getElementsByTagName('head')[0].insertAdjacentElement('afterend', tmpScript);
})();

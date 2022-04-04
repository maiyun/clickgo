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
    'version': '3.0.0',
    'safe': true,
    'rootPath': window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1),
    'cgRootPath': '',
    'cdnPath': 'https://cdn.jsdelivr.net',
    'native': navigator.userAgent.toLowerCase().includes('electron') ? true : false,

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
    const temp = document.querySelectorAll('script');
    const scriptEle = temp[temp.length - 1];

    // --- 获取 js 文件基路径，以 / 结尾 ---
    clickgo.cgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf('/') + 1);
    // --- 获取第三方库的引用路径基 ---
    const lio = scriptEle.src.lastIndexOf('?');
    if (lio !== -1) {
        const match = /[?&]cdn=(.+?)($|&)/.exec(scriptEle.src.slice(lio));
        if (match) {
            clickgo.cdnPath = match[1];
        }
    }

    // --- 加载 loader ---
    const tmpScript = document.createElement('script');
    tmpScript.src = clickgo.cdnPath + '/npm/@litert/loader@3.0.5/dist/loader.min.js';
    tmpScript.addEventListener('load', function(): void {
        loader.ready(async () => {
            // --- 通过标签加载库 ---
            const paths: string[] = [
                clickgo.cdnPath + '/npm/vue@3.2.31/dist/vue.global.min.js'
            ];
            // --- 判断 ResizeObserver 是否存在 ---
            let ro = true;
            // ResizeObserver = undefined;
            if (!((window as any).ResizeObserver)) {
                ro = false;
                paths.push(clickgo.cdnPath + '/npm/@juggle/resize-observer@3.3.1/lib/exports/resize-observer.umd.min.js');
            }
            // --- 加载 vue 以及必要库 ---
            await loader.loadScripts(paths);
            // --- 处理 ResizeObserver ---
            if (!ro) {
                (window as any).ResizeObserverEntry = (window as any).ResizeObserver.ResizeObserverEntry;
                (window as any).ResizeObserver = (window as any).ResizeObserver.ResizeObserver;
            }
            // --- map 加载库 ---
            const map: Record<string, string> = {
                'jszip': clickgo.cdnPath + '/npm/jszip@3.8.0/dist/jszip.min'
            };
            // --- 加载 clickgo 主程序 ---
            const files = await loader.sniffFiles('clickgo.js', {
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
            // --- 执行 ready ---
            clickgo.isReady = true;
            for (const func of clickgo.readys) {
                const r = func();
                if (r instanceof Promise) {
                    r.catch(function(e) {
                        console.log(e);
                    });
                }
            }
        });
    });
    document.getElementsByTagName('head')[0].insertAdjacentElement('afterend', tmpScript);
})();

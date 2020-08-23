/**
 * Copyright 2020 Han Guoshuai <zohegs@gmail.com>
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

/** --- 获取当前 cg index 的基路径 --- */
let tmpCgRootPath: string = '';
(function() {
    let temp = document.querySelectorAll('head > script');
    let scriptEle = temp[temp.length - 1] as HTMLScriptElement;
    tmpCgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf('/') + 1);
})();

/** --- 当前缩放情况 --- */
let tmpZoom = 1;
if (window.devicePixelRatio < 2) {
    tmpZoom = 1 / window.devicePixelRatio;
}

/** --- ClickGo 对象 --- */
const clickgo: IClickGo = {
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
    getPosition: function(): IClickGoPositionResult {
        return {
            'left': this.position.left ?? 0,
            'top': this.position.top ?? 0,
            'width': window.innerWidth * this.rzoom + (this.position.offsetWidth ?? 0),
            'height': window.innerHeight * this.rzoom + (this.position.offsetHeight ?? 0),
            'offsetWidth': this.position.offsetWidth ?? 0,
            'offsetHeight': this.position.offsetHeight ?? 0
        };
    },

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

    'core': {} as ICoreLib,
    'element': {} as IElementLib,
    'form': {} as IFormLib,
    'theme': {} as IThemeLib,
    'tool': {} as IToolLib
};

// --- 加载 loader ---
let tmpScript = document.createElement('script');
tmpScript.src = 'https://cdn.jsdelivr.net/npm/@litert/loader@1.0.0-beta/dist/index.min.js';
tmpScript.addEventListener('load', function(): void {
    loader.ready(async () => {
        // --- 设置 loader 库配置 ---
        loader.setAfter('?' + Math.random());
        // --- 加载库 ---
        let paths: string[] = [
            'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js'
        ];
        for (let path of paths) {
            if (!await loader.loadScript(document.getElementsByTagName('head')[0], path)) {
                alert('Librarys load failed.');
                return;
            }
        }
        let [cg] = await loader.require(clickgo.cgRootPath + 'clickgo') ?? [];
        if (!clickgo) {
            alert('Clickgo load failed.');
            return;
        }
        clickgo.core = cg.core;
        clickgo.element = cg.element;
        clickgo.form = cg.form;
        clickgo.theme = cg.theme;
        clickgo.tool = cg.tool;
        // --- 执行 ready ---
        clickgo.isReady = true;
        for (let func of clickgo.readys) {
            const rtn = func();
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
        }
    });
});
document.getElementsByTagName('head')[0].insertAdjacentElement('afterend', tmpScript);

// --- 优化手机点击行为 ---
document.addEventListener('touchstart', function() {
    return;
});

"use strict";
const electron = require('electron');

electron.contextBridge.exposeInMainWorld('clickgoNative', {
    invoke: (name, ...param) => electron.ipcRenderer.invoke('pre', name, ...param)
});

if (electron.ipcRenderer.sendSync('file-open-enabled')) {
    // --- 仅拦截真实文件拖入，防止 Chromium 把本地文件导航到当前 ClickGo 页面 ---
    window.addEventListener('dragover', function(event) {
        if (event.dataTransfer?.files.length) {
            event.preventDefault();
        }
    }, true);
    window.addEventListener('drop', function(event) {
        if (!event.dataTransfer?.files.length) {
            return;
        }
        event.preventDefault();
        const paths = [];
        for (const file of event.dataTransfer.files) {
            const path = electron.webUtils.getPathForFile(file);
            if (path) {
                paths.push(path);
            }
        }
        if (paths.length) {
            electron.ipcRenderer.send('drop-files', paths);
        }
    }, true);
}

"use strict";
const electron = require('electron');

electron.contextBridge.exposeInMainWorld('clickgoNative', {
    invoke: (name, ...param) => electron.ipcRenderer.invoke('pre', name, ...param)
});

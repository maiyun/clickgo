"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
electron.contextBridge.exposeInMainWorld('clickgoNative', {
    invoke: function (name, ...param) {
        return electron.ipcRenderer.invoke('pre', name, ...param);
    }
});

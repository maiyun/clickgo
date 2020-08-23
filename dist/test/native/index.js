"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron = require("electron");
function createWindow() {
    var win = new electron.BrowserWindow({
        'width': 400,
        'height': 250,
        'frame': false,
        'resizable': false,
        'backgroundColor': '#24292e',
        'show': false
    });
    win.once('ready-to-show', function () {
        win.show();
    });
    win.loadFile('index.html').catch(function (e) {
        throw e;
    });
}
electron.app.whenReady().then(createWindow).catch(function (e) {
    throw e;
});
electron.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron.app.quit();
    }
});
electron.app.on('activate', function () {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

import * as electron from 'electron';

function createWindow(): void {
    const win = new electron.BrowserWindow({
        'width': 400,
        'height': 250,
        'frame': false,
        'resizable': false,
        'backgroundColor': '#24292e',
        'show': false
    });
    win.once('ready-to-show', function(): void {
        win.show();
    });
    win.loadFile('index.html').catch(function(e): void {
        throw e;
    });
}

electron.app.whenReady().then(createWindow).catch(function(e): void {
    throw e;
});

electron.app.on('window-all-closed', function(): void {
    if (process.platform !== 'darwin') {
        electron.app.quit();
    }
});

electron.app.on('activate', function(): void {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

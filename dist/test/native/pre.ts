import * as electron from 'electron';

electron.contextBridge.exposeInMainWorld('clickgoNative', {
    invoke: function(name: string, ...param: any[]) {
        return electron.ipcRenderer.invoke('pre', name, ...param);
    }
});

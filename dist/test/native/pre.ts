import * as electron from 'electron';

electron.contextBridge.exposeInMainWorld('clickgoNative', {
    invoke: function(name: string, ...param: any[]): Promise<void> {
        return electron.ipcRenderer.invoke('pre', name, ...param);
    }
});

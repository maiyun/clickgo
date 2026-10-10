// Run after TypeScript compilation: node --experimental-vm-modules test/native-window.mjs
// Pass a compiled Native entry path to check another runtime copy with the same regressions.
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';
import * as crypto from 'node:crypto';
import { SourceTextModule, SyntheticModule } from 'node:vm';

let window;
let ipc;
let dropFiles;
let fileOpenEnabled;
let handled = true;
let queries = 0;
let quits = 0;
let locks = 0;
let activations = 0;
let startMcp = async () => false;
const openFilePaths = ['/tmp/first.txt', '/tmp/second.txt', '/tmp/third.txt', '/tmp/fourth.txt'];
const entryArg = process.argv[2];
const originalArgv = process.argv;
process.argv = ['/electron', '/app/index.js', openFilePaths[0]];
const app = new EventEmitter();
app.getAppPath = () => '/app';
app.getVersion = () => '1.0.0';
app.getPath = () => '/app/user-data';
app.getName = () => 'Native test';
app.whenReady = async () => {};
app.requestSingleInstanceLock = () => { ++locks; return true; };
app.quit = () => { ++quits; window.close(); };
class BrowserWindow extends EventEmitter {
    constructor(options) {
        super();
        window = this;
        this.options = options;
        this.size = [options.width, options.height];
        this.minimum = [0, 0];
        this.savedMinimum = [0, 0];
        this._resizable = options.resizable;
        this.destroyed = false;
        this.webContents = new EventEmitter();
        this.webContents.mainFrame = { url: url.pathToFileURL('/app/index.html').href };
        this.webContents.getURL = () => this.webContents.mainFrame.url;
        this.webContents.setWindowOpenHandler = () => {};
        this.webContents.executeJavaScript = async () => { ++queries; return handled; };
    }
    async loadFile() { this.webContents.emit('did-navigate'); }
    isDestroyed() { return this.destroyed; }
    get resizable() { return this._resizable; }
    set resizable(value) {
        // Electron restores the pre-lock constraints when resizing is enabled on Linux.
        if (value && !this._resizable) { this.minimum = [...this.savedMinimum]; }
        this._resizable = value;
    }
    setMinimumSize(w, h) {
        this.minimum = [w, h];
        if (this._resizable) { this.savedMinimum = [...this.minimum]; }
    }
    getSize() { return this.size; }
    setSize(w, h) { this.size = [w, h]; }
    center() {}
    isMinimized() { return false; }
    restore() {}
    setAlwaysOnTop() {}
    show() {}
    focus() { ++activations; }
    close() {
        let prevented = false;
        this.emit('close', { preventDefault() { prevented = true; } });
        if (!prevented) { this.destroyed = true; this.emit('closed'); }
    }
}
function synthetic(exports) {
    return new SyntheticModule(Object.keys(exports), function() {
        for (const [key, value] of Object.entries(exports)) { this.setExport(key, value); }
    });
}
const dependencies = {
    'electron': synthetic({ app, BrowserWindow, Menu: { setApplicationMenu() {} },
        ipcMain: {
            handle(name, callback) { ipc = callback; },
            on(name, callback) {
                if (name === 'drop-files') { dropFiles = callback; }
                if (name === 'file-open-enabled') { fileOpenEnabled = callback; }
            },
        } }),
    'node:fs': synthetic({
        statSync(value) {
            if (!openFilePaths.includes(value)) { throw new Error('File not found'); }
            return { isFile: () => true };
        }
    }),
    'path': synthetic(path),
    'node:url': synthetic(url),
    'node:crypto': synthetic(crypto),
    './lib/fs.js': synthetic({ refreshDrives: async () => {} }),
    './lib/tool.js': synthetic({ parsePath: value => value }),
    './lib/mcp.js': synthetic({ start: (...args) => startMcp(...args) }),
};
const entry = entryArg ? url.pathToFileURL(path.resolve(entryArg)) : new URL('../dist/test/native/native.js', import.meta.url);
const mod = new SourceTextModule(await readFile(entry, 'utf8'), {
    initializeImportMeta(meta) { meta.url = entry.href; },
});
await mod.link(name => dependencies[name]);
await mod.evaluate();
class Boot extends mod.namespace.AbstractBoot { main() {} }
const boot = new Boot();
const run = () => {
    boot.run('/app/index.html', { frame: false, icon: '/app/icon.png' });
    const frame = window.webContents.mainFrame;
    const event = { sender: window.webContents, senderFrame: frame };
    ipc(event, 'cg-init', 'secret');
    return (...params) => ipc(event, ...params);
};
let invoke = run();
const disabledDrop = { sender: window.webContents };
fileOpenEnabled(disabledDrop);
assert.equal(disabledDrop.returnValue, false);
// Even without explicit Form minimums, the immediate watchers send the default 200x100.
invoke('cg-set-min-size', 'secret', 200, 100);
invoke('cg-set-size', 'secret', 50, 50);
assert.deepEqual(window.minimum, [200, 100]);
assert.deepEqual(window.size, [200, 100]);
invoke('cg-close', 'secret');
invoke = run();
assert.equal(window.options.icon, '/app/icon.png');
for (const args of [['bad', 360, 240], ['secret', -1, 240], ['secret', 1.5, 240], ['secret', NaN, 240]]) {
    invoke('cg-set-min-size', ...args);
    assert.deepEqual(window.minimum, [0, 0]);
}
// Form's immediate watchers send minimum size before form.create unlocks the window.
invoke('cg-set-min-size', 'secret', 360, 240);
assert.equal(window.resizable, false);
assert.deepEqual(window.size, [600, 400]);
invoke('cg-set-size', 'secret', 200, 100);
assert.deepEqual(window.minimum, [360, 240]);
assert.deepEqual(window.size, [360, 240]);
invoke('cg-set-min-size', 'secret', 420, 300);
assert.deepEqual(window.minimum, [420, 300]);
invoke('cg-set-size', 'secret', 100, 100);
assert.deepEqual(window.minimum, [420, 300]);
assert.deepEqual(window.size, [420, 300]);
invoke('cg-set-min-size', 'secret', 0, 0);
assert.deepEqual(window.minimum, [0, 0]);

window.close();
window.close();
await new Promise(r => setImmediate(r));
assert.equal(window.destroyed, false);
assert.equal(queries, 1);
invoke('cg-close', 'bad');
assert.equal(window.destroyed, false);
invoke('cg-close', 'secret');
assert.equal(window.destroyed, true);
assert.equal(queries, 1);

invoke = run();
assert.deepEqual(window.minimum, [0, 0]);
invoke('cg-set-size', 'secret', 500, 400);
assert.deepEqual(window.minimum, [0, 0]);
invoke('cg-set-min-size', 'secret', 360, 240);
assert.deepEqual(window.minimum, [360, 240]);
handled = false;
window.close();
await new Promise(r => setImmediate(r));
assert.equal(window.destroyed, true);

invoke = run();
invoke('cg-set-min-size', 'secret', 360, 240);
invoke('cg-set-min-size', 'secret', 420, 300);
invoke('cg-set-min-size', 'bad', 0, 0);
invoke('cg-set-size', 'secret', 200, 100);
assert.deepEqual(window.minimum, [420, 300]);
assert.deepEqual(window.size, [420, 300]);
handled = true;
invoke('cg-quit', 'secret');
assert.equal(quits, 1);
assert.equal(window.destroyed, true);

class SingleBoot extends mod.namespace.AbstractBoot { main() {} }
mod.namespace.launcher(new SingleBoot(), { singleInstance: true });
await new Promise(r => setImmediate(r));
assert.equal(locks, 1);
app.removeAllListeners('second-instance');

const opened = [];
class FileBoot extends mod.namespace.AbstractBoot {
    onOpenFiles(paths) { opened.push(paths); }
    main() { this.run('/app/index.html', { frame: false }); }
}
mod.namespace.launcher(new FileBoot(), { openFiles: true, singleInstance: true });
await new Promise(r => setImmediate(r));
assert.equal(locks, 2);
assert.deepEqual(opened, [[openFilePaths[0]]]);
const enabledDrop = { sender: window.webContents };
fileOpenEnabled(enabledDrop);
assert.equal(enabledDrop.returnValue, true);
let prevented = false;
app.emit('open-file', { preventDefault() { prevented = true; } }, openFilePaths[1]);
assert.equal(prevented, true);
app.emit('second-instance', {}, ['/electron', openFilePaths[2]], '/');
dropFiles({ sender: window.webContents }, [openFilePaths[3]]);
assert.equal(activations, 2);
assert.deepEqual(opened, [
    [openFilePaths[0]],
    [openFilePaths[1]],
    [openFilePaths[2]],
    [openFilePaths[3]],
]);
process.argv = originalArgv;
console.log('Native icon, minimum-size, close-bridge and file-open regression checks passed.');

// --- 启动监听期间停止或关闭窗口，都不能留下稍后启用的服务。 ---
invoke = run();
let ready;
let closed = false;
const service = { info: { transport: 'streamable-http', url: 'http://localhost/mcp', token: 'test' },
    close: async () => { closed = true; } };
let callMcp;
startMcp = async invoke => { callMcp = invoke; return service; };
assert.deepEqual(await mod.namespace.startMcp(), service.info);
const scripts = [];
window.webContents.executeJavaScript = async code => {
    scripts.push(code);
    const payload = JSON.parse(JSON.parse(code.match(/JSON.parse\((.*)\)\)$/)[1]));
    assert.equal(Object.hasOwn(payload.args, '__proto__'), true);
    assert.equal(Object.getPrototypeOf(payload.args), Object.prototype);
    assert.equal(payload.name, 'quote";unexpected()');
    return { ok: true, data: 'preserved JSON' };
};
assert.deepEqual(await callMcp({ method: 'execute', taskId: 'app', name: 'quote";unexpected()',
    args: JSON.parse('{"__proto__":{"value":1}}') }, new AbortController().signal), { ok: true, data: 'preserved JSON' });
assert.equal(scripts.length, 1);
await mod.namespace.stopMcp();
assert.equal(closed, true);
closed = false;
startMcp = () => new Promise(resolve => { ready = resolve; });
const starting = mod.namespace.startMcp();
assert.equal(await mod.namespace.startMcp(), false);
const stopping = mod.namespace.stopMcp();
ready(service);
assert.equal(await starting, false);
await stopping;
assert.equal(closed, true);
assert.equal(mod.namespace.getMcpInfo(), null);
closed = false;
const afterClose = mod.namespace.startMcp();
invoke('cg-close', 'secret');
ready(service);
assert.equal(await afterClose, false);
assert.equal(closed, true);
assert.equal(mod.namespace.getMcpInfo(), null);
assert.equal(await mod.namespace.startMcp(), false);
console.log('Native MCP duplicate start, stop during startup and window-close cleanup checks passed.');

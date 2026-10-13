// Electron acceptance: electron test/native-storage-electron.mjs <write|read> <temporary userData directory>
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, writeFile, readFile, readdir, rename } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { app, BrowserWindow } from 'electron';
const nativeEntry = process.env['CLICKGO_NATIVE_STORAGE_ENTRY'];
const native = await import(nativeEntry ? pathToFileURL(resolve(nativeEntry)).href :
    new URL('../dist/test/native/native.js', import.meta.url).href);

const modeIndex = process.argv.findIndex(value => value === 'write' || value === 'read');
assert.ok(modeIndex > 0);
const mode = process.argv[modeIndex];
const directory = resolve(process.argv[modeIndex + 1]);
app.setPath('userData', directory);
const repository = fileURLToPath(new URL('../', import.meta.url));
const host = join(directory, 'acceptance.html');
await mkdir(directory, { recursive: true });
const installed = join(directory, 'installed');
const relocated = join(directory, 'relocated');
if (mode === 'write') {
    await mkdir(installed, { recursive: true });
    await copyFile(join(repository, 'dist/app/demo.cga'), join(installed, 'app.cga'));
}
else {
    await rename(installed, relocated);
}
const bundle = pathToFileURL(join(mode === 'write' ? installed : relocated, 'app.cga')).href;
await writeFile(host, `<!doctype html><html><head><meta charset="utf-8">
<script type="importmap">${JSON.stringify({ imports: { clickgo: pathToFileURL(join(repository, 'dist/index.js')).href } })}</script>
</head><body><script type="module">
import * as clickgo from 'clickgo';
window.storageErrors = [];
window.addEventListener('unhandledrejection', event => window.storageErrors.push(String(event.reason)));
class Boot extends clickgo.AbstractBoot {
    async main() {
        window.storageTest = { clickgo };
        const taskId = await clickgo.task.run(this._sysId, ${JSON.stringify(bundle)}, {
            permissions: ['native.form'], notify: false
        });
        window.storageTest.taskId = taskId;
        const secondApp = await clickgo.core.fetchApp(this._sysId, ${JSON.stringify(bundle)});
        if (!secondApp) { window.storageErrors.push('Second App package unavailable'); return; }
        secondApp.config = { ...secondApp.config, id: 'net.example.secondary' };
        const secondTaskId = await clickgo.task.run(this._sysId, secondApp, {
            permissions: ['native.form'], notify: false
        });
        window.storageTest = { clickgo, taskId, secondTaskId };
    }
    onError(taskId, formId, error, info) {
        window.storageErrors.push({ taskId, formId, error: String(error), info });
    }
}
await clickgo.launcher(new Boot());
</script></body></html>`);
class Boot extends native.AbstractBoot {
    main() {
        this.run(host, { width: 1000, height: 760 });
        const page = BrowserWindow.getAllWindows()[0].webContents;
        page.on('console-message', details => console.log(details.message));
        page.setBackgroundThrottling(false);
        void verify(page);
    }
}
async function verify(page) {
    try {
        const deadline = Date.now() + 60000;
        let loaded;
        while (Date.now() < deadline) {
            if (!page.isLoading()) {
                loaded = await page.executeJavaScript("typeof window.storageTest?.taskId === 'string' && typeof window.storageTest?.secondTaskId === 'string'");
                if (loaded) { break; }
                const failed = await page.executeJavaScript("window.storageErrors?.length > 0");
                if (failed) { break; }
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        if (!loaded) {
            console.error(await page.executeJavaScript("({ taskId: window.storageTest?.taskId, secondTaskId: window.storageTest?.secondTaskId, errors: window.storageErrors })"));
        }
        assert.equal(loaded, true, 'real packed Demo loads');
        const identity = await page.executeJavaScript(`(() => {
            const task = window.storageTest.clickgo.task.getOrigin(window.storageTest.taskId);
            return { taskId: task.id, appId: task.appId, path: task.path };
        })()`);
        assert.equal(identity.appId, 'net.maiyun.clickgo-demo');
        if (mode === 'write') {
            await writeFile(join(directory, 'identity.json'), JSON.stringify(identity));
        }
        else {
            const previous = JSON.parse(await readFile(join(directory, 'identity.json'), 'utf8'));
            assert.notEqual(identity.path, previous.path, 'the actual CGA file moved to another directory');
            assert.notEqual(identity.taskId, previous.taskId, 'the running instance changed after restart');
            assert.equal(identity.appId, previous.appId, 'fixed App ID survives relocation');
        }
        const call = (name, args = [], second = false) => page.executeJavaScript(`(() => {
            const { clickgo, taskId, secondTaskId } = window.storageTest;
            return clickgo.native.${name}(${second} ? secondTaskId : taskId, ...${JSON.stringify(args)});
        })()`);
        const available = await call('secret.isAvailable');
        if (mode === 'write') {
            assert.equal(await native.storage.set('host.setting', { enabled: false }), true);
            assert.equal(await call('storage.set', ['app.setting', { port: 0, enabled: false }]), true);
            assert.equal(await call('storage.get', ['host.setting']), null);
            assert.equal(await native.storage.get('app.setting'), null);
            assert.deepEqual(await native.storage.get('app.setting', identity.appId), { value: { port: 0, enabled: false } });
            assert.equal(await call('storage.get', ['missing']), null);
            assert.equal(await call('storage.get', ['app.setting'], true), null);
            assert.equal(await call('storage.set', ['app.setting', 'second'], true), true);
            assert.deepEqual(await call('storage.get', ['app.setting']), { value: { port: 0, enabled: false } });
            assert.equal(await call('secret.set', ['app.secret', 'test-only-secret']), available);
            assert.equal(await native.secret.get('app.secret', identity.appId), available ? 'test-only-secret' : null);
            if (available) {
                const secretDirectory = join(directory, 'clickgo-native', 'apps',
                    createHash('sha256').update(identity.appId).digest('hex'), 'secret');
                const files = await readdir(secretDirectory);
                for (const file of files) {
                    const data = await readFile(join(secretDirectory, file));
                    assert.equal(data.includes(Buffer.from('test-only-secret')), false);
                }
            }
            // Open the visible demo through its existing method page.
            await page.executeJavaScript(`(() => {
                const sdk = window.storageTest.clickgo;
                const task = sdk.task.getOrigin(window.storageTest.taskId);
                const main = Object.values(task.forms)[0].vroot;
                void main.openForm('mnative');
            })()`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const image = await page.capturePage();
            await writeFile(join(directory, 'demo.png'), image.toPNG());
        }
        else {
            assert.equal(await native.storage.get('app.setting'), null);
            assert.deepEqual(await native.storage.get('app.setting', identity.appId), { value: { port: 0, enabled: false } });
            assert.equal(await call('storage.get', ['host.setting']), null);
            assert.equal(await call('secret.get', ['app.secret']), available ? 'test-only-secret' : null);
            assert.deepEqual(await call('storage.get', ['app.setting']), { value: { port: 0, enabled: false } });
            assert.deepEqual(await call('storage.get', ['app.setting'], true), { value: 'second' });
            assert.equal(await call('storage.remove', ['app.setting']), true);
            assert.deepEqual(await call('storage.get', ['app.setting'], true), { value: 'second' });
            assert.equal(await call('storage.remove', ['app.setting'], true), true);
            assert.equal(await native.storage.get('app.setting'), null);
            assert.equal(await native.storage.remove('host.setting'), true);
            assert.equal(await call('secret.remove', ['app.secret']), true);
        }
        console.log(`Real Electron ${mode}: fixed App ID, relocation, root-free storage and isolation passed; secure storage available: ${available}.`);
    }
    catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
    finally {
        for (const window of BrowserWindow.getAllWindows()) { window.destroy(); }
        app.exit(process.exitCode ?? 0);
    }
}
native.launcher(new Boot());

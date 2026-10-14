import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { EventEmitter } from 'node:events';

const libraries = process.argv[2] ? resolve(process.argv[2]) : new URL('../../test/native/lib/', import.meta.url).pathname;
const synthetic = values => new SyntheticModule(Object.keys(values), function() {
    for (const [key, value] of Object.entries(values)) this.setExport(key, value);
});
async function create() {
    const app = { isPackaged: true, getVersion: () => '1.0.0' };
    const sdk = new EventEmitter();
    let imports = 0, checks = 0, downloads = 0, installs = 0;
    let check = async () => ({ isUpdateAvailable: true, updateInfo: { version: '2.0.0', files: ['private-url'] } });
    let download = async () => ['private-installer-path'];
    let install = () => {};
    sdk.logger = { error() {} };
    sdk.checkForUpdates = () => { ++checks; return check(); };
    sdk.downloadUpdate = () => { ++downloads; return download(); };
    sdk.quitAndInstall = (silent, restart) => { ++installs; assert.equal(silent, false); assert.equal(restart, true); install(); };
    const vendor = synthetic({ default: { autoUpdater: sdk } });
    await vendor.link(() => {}); await vendor.evaluate();
    const adapter = new SourceTextModule(await readFile(resolve(libraries, '../abox/update.js'), 'utf8'), {
        importModuleDynamically: name => { assert.equal(name, 'electron-updater'); ++imports; return vendor; },
    });
    await adapter.link(() => {});
    const controller = new SourceTextModule(await readFile(resolve(libraries, 'update.js'), 'utf8'));
    await controller.link(name => name === 'electron' ? synthetic({ app }) : adapter);
    await controller.evaluate();
    return { api: controller.namespace, app, sdk, counts: () => ({ imports, checks, downloads, installs }),
        check: value => { check = value; }, download: value => { download = value; }, install: value => { install = value; } };
}
const savedPortable = process.env.PORTABLE_EXECUTABLE_FILE;
delete process.env.PORTABLE_EXECUTABLE_FILE;
try {
    const m = await create();
    assert.equal((await m.api.checkUpdates()).reason, 'not-enabled');
    m.api.setEnabled(true); m.app.isPackaged = false;
    assert.equal((await m.api.downloadUpdate()).reason, 'development');
    m.app.isPackaged = true; process.env.PORTABLE_EXECUTABLE_FILE = '/portable.exe';
    assert.equal(m.api.installUpdate().reason, 'portable');
    delete process.env.PORTABLE_EXECUTABLE_FILE;
    assert.equal(m.counts().imports, 0, 'disabled/CLI initialization never loads SDK');
    assert.equal(m.api.installUpdate().errorCode, 'not-ready');
    let finish;
    m.check(() => new Promise(resolve => { finish = resolve; }));
    const p = m.api.checkUpdates(); const duplicate = m.api.checkUpdates();
    assert.equal(p, duplicate, 'concurrent checks share one operation');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal((await m.api.downloadUpdate()).errorCode, 'not-ready');
    assert.equal(m.sdk.autoDownload, false); assert.equal(m.sdk.autoInstallOnAppQuit, false);
    assert.equal(m.counts().downloads, 0);
    finish({ isUpdateAvailable: true, updateInfo: { version: '2.0.0' } });
    assert.equal((await p).status, 'available');
    const notices = [];
    m.api.onUpdateState(() => { throw new Error('subscriber'); });
    const unsubscribe = m.api.onUpdateState(state => notices.push(state));
    m.download(() => new Promise(resolve => { finish = resolve; }));
    const downloading = m.api.downloadUpdate();
    assert.equal(m.api.downloadUpdate(), downloading);
    await new Promise(resolve => setImmediate(resolve));
    m.sdk.emit('download-progress', { percent: 150, transferred: -1, total: Infinity, bytesPerSecond: 100 });
    assert.deepEqual(m.api.getUpdateState().progress, { percent: 100, transferred: 0, total: 0, bytesPerSecond: 100 });
    const snapshot = m.api.getUpdateState(); snapshot.progress.percent = 12;
    assert.equal(m.api.getUpdateState().progress.percent, 100, 'state snapshots are isolated');
    assert.equal((await m.api.checkUpdates()).status, 'downloading');
    finish(['/installer']);
    assert.equal((await downloading).status, 'downloaded');
    assert.equal((await m.api.checkUpdates()).version, '2.0.0');
    assert.equal(m.counts().checks, 1, 'downloaded target remains fixed');
    assert.equal(m.api.installUpdate().status, 'restarting');
    assert.equal(m.api.installUpdate().status, 'restarting');
    assert.equal(m.counts().installs, 1);
    m.sdk.emit('error', new Error('private provider detail'));
    assert.equal(m.api.getUpdateState().errorCode, 'install-failed');
    assert.equal((await m.api.checkUpdates()).status, 'downloaded', 'installation can be retried without changing target');
    m.install(() => { throw new Error('installer'); });
    assert.equal(m.api.installUpdate().errorCode, 'install-failed');
    assert.ok(notices.some(state => state.status === 'downloading'));
    assert.ok(!JSON.stringify(notices).includes('private'), 'public states never expose vendor errors, URLs or installer paths');
    const length = notices.length; unsubscribe(); m.api.installUpdate(); assert.equal(notices.length, length);

    const failure = await create(); failure.api.setEnabled(true);
    failure.check(async () => { throw new Error('network'); });
    assert.equal((await failure.api.checkUpdates()).errorCode, 'check-failed');
    failure.check(async () => ({ isUpdateAvailable: false, updateInfo: { version: '1.0.0' } }));
    assert.equal((await failure.api.checkUpdates()).status, 'up-to-date');
    assert.equal((await failure.api.downloadUpdate()).errorCode, 'not-ready');
    failure.check(async () => ({ isUpdateAvailable: true, updateInfo: { version: '2.0.0' } }));
    await failure.api.checkUpdates();
    failure.download(async () => { throw new Error('checksum'); });
    assert.equal((await failure.api.downloadUpdate()).errorCode, 'download-failed');
    assert.equal(failure.api.installUpdate().errorCode, 'not-ready', 'failed downloads are never installed');
    await failure.api.checkUpdates(); failure.download(async () => ['/verified']);
    assert.equal((await failure.api.downloadUpdate()).status, 'downloaded');
    failure.check(async () => null);
    const unavailable = await create(); unavailable.api.setEnabled(true); unavailable.check(async () => null);
    assert.equal((await unavailable.api.checkUpdates()).status, 'disabled');
    console.log('Update SDK lazy loading, manual actions, concurrency, progress, target locking and failure recovery passed.');
}
finally {
    if (savedPortable === undefined) delete process.env.PORTABLE_EXECUTABLE_FILE;
    else process.env.PORTABLE_EXECUTABLE_FILE = savedPortable;
}

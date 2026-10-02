import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const requests = new Map();
const styles = [];
const progress = [];
const events = [];
let id = 0;
let taskApi;
function getContent(taskId, path) {
    return new Promise((resolve, reject) => requests.set(path, { resolve, reject }));
}
const tool = {
    urlResolve: (base, path) => path,
    random: () => `id${++id}`,
    stateMachine() {},
    runIife: () => class { async main() { events.push('main'); } },
    stylePrepend: style => ({ prep: '', style }),
    styleUrl2DataUrl: async (base, style) => style,
    layoutAddTagClassAndReTagName: layout => layout,
    layoutClassPrepend: layout => layout,
    eventsAttrWrap: layout => layout,
    getClassPrototype: () => ({ method: {}, access: {} }),
};
const core = { config: { locale: 'en' }, trigger: async (...args) => { events.push(args); } };
const form = { notify() {}, notifyContent() {} };
const dom = { createToStyleList() {}, removeFromStyleList() {}, pushStyle: (taskId, style) => styles.push(style) };
const zip = { get: async blob => {
    const label = await blob.text();
    return {
        readDir: path => path === '/' ? [{ name: 'same', isFile: false }] : [
            { path: 'same/', name: 'layout.html' }, { path: 'same/', name: 'style.css' },
        ],
        getContent: async path => path.endsWith('config.json') ?
            JSON.stringify({ name: 'same', layout: 'layout', style: 'style' }) :
            path.endsWith('html') ? `<div>${label}</div>` : label,
    };
} };
tool.getMimeByPath = name => ({ ext: name.split('.').pop() });
async function load(file, modules) {
    const source = await readFile(new URL(`../dist/lib/${file}.ts`, import.meta.url), 'utf8');
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, { exports, require: name => modules[name] ?? {}, Blob, setTimeout, clearTimeout,
        window: { innerWidth: 800, innerHeight: 600 } });
    return exports;
}
const clickgo = { getDirname: () => '/clickgo/', modules: { vue: { reactive: value => value, watch() {} } } };
const common = { '../clickgo': clickgo, './tool': tool, './core': core, './fs': { getContent }, './dom': dom, './form': form };
const controls = await load('control', { ...common, './zip': zip, './task': { getOrigin: taskId => taskApi.getOrigin(taskId) } });
const themeOrder = [];
taskApi = await load('task', { ...common, './control': controls, './theme': {
    read: async blob => ({ name: await blob.text() }),
    load: async (taskId, theme) => { themeOrder.push(theme?.name ?? 'global'); },
} });
taskApi.initSysId('sys');
taskApi.init();
const app = {
    type: 'app', config: { name: 'Concurrent packages', controls: ['/a', '/b.cgc'], themes: ['/light', '/dark'] },
    package: { getContent: async path => path === '/app.js' ? 'app fixture' : null },
};
const running = taskApi.run('sys', app, { notify: false, progress: (loaded, total, type, path) => progress.push(path) });
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual([...requests.keys()], ['/light.cgt', '/dark.cgt', '/a.cgc', '/b.cgc'], 'all themes and controls request before the first package completes');
requests.get('/b.cgc').resolve(new Blob(['second']));
requests.get('/dark.cgt').resolve(new Blob(['dark']));
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(styles, [], 'later downloads cannot change registration order');
assert.deepEqual(themeOrder, [], 'themes wait for controls and preceding themes');
requests.get('/a.cgc').resolve(new Blob(['first']));
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(styles, ['first', 'second'], 'CSS registers in configured order');
assert.deepEqual(progress, ['/a.cgc', '/b.cgc']);
requests.get('/light.cgt').resolve(new Blob(['light']));
const taskId = await running;
assert.equal(typeof taskId, 'string');
assert.ok(taskApi.getOrigin(taskId).controls.same.layout.includes('second'), 'last configured duplicate control wins');
assert.deepEqual(themeOrder, ['light', 'dark'], 'theme application preserves configured order');
assert.equal(events.at(-1), 'main');

requests.clear();
const failed = taskApi.run('sys', { ...app, config: { ...app.config, controls: ['/missing', '/later'], themes: ['/unused'] } }, { notify: false });
await new Promise(resolve => setImmediate(resolve));
requests.get('/later.cgc').reject(new Error('later request failure'));
requests.get('/unused.cgt').reject(new Error('unused theme failure'));
await new Promise(resolve => setImmediate(resolve));
requests.get('/missing.cgc').resolve(null);
assert.equal(await failed, -905, 'missing control retains the task failure code');
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(themeOrder, ['light', 'dark'], 'failure does not apply prefetched themes');
console.log('Concurrent CGC/CGT downloads, ordered registration/themes, duplicate controls and failure handling passed.');

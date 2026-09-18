// Run: node --experimental-vm-modules test/web-drag-mask.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
for (const name of ['window', 'document', 'Element', 'SVGElement', 'Node', 'HTMLElement']) {
    globalThis[name] = dom.window[name];
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
const { createApp, compile, reactive, nextTick } = await import('vue');
const pointer = await import('@litert/pointer');
const state = reactive({ move: false });
const clickgo = new SyntheticModule(['control', 'dom'], function() {
    this.setExport('control', { AbstractControl: class {} });
    this.setExport('dom', { is: state });
});
const source = await readFile(new URL('../dist/sources/control/web/code.ts', import.meta.url), 'utf8');
const web = new SourceTextModule(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText);
await web.link(() => clickgo);
await web.evaluate();
const control = new web.namespace.default();

// Exercise the actual launcher hooks with the installed Pointer library.
const launcher = await readFile(new URL('../dist/clickgo.ts', import.meta.url), 'utf8');
const hookSource = launcher.match(/    modules\.pointer\.addMoveHook\('down',[\s\S]*?    modules\.pointer\.addMoveHook\('up',[\s\S]*?    \}\);/)[0];
const hooks = new SourceTextModule(`import { pointer, is } from 'bridge';
    const modules = { pointer }; const lDom = { is }; ${hookSource}`);
const bridge = new SyntheticModule(['pointer', 'is'], function() {
    this.setExport('pointer', pointer);
    this.setExport('is', state);
});
await hooks.link(() => bridge);
await hooks.evaluate();

const template = await readFile(new URL('../dist/sources/control/web/layout.html', import.meta.url), 'utf8');
const host = document.createElement('div');
document.body.append(host);
const app = createApp({
    render: compile(template),
    data: () => ({ src: 'about:blank' }),
    computed: { showMask: () => control.showMask },
});
app.mount(host);
const iframe = host.querySelector('iframe');
const mask = host.querySelector('.mask');
assert.equal(iframe.getAttribute('src'), 'about:blank');
assert.equal(mask.style.display, 'none');

function event(type, x, y) {
    const e = new dom.window.Event(type, { bubbles: true, cancelable: true });
    Object.assign(e, { clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', button: 0 });
    return e;
}

for (const operation of ['move', 'resize']) {
    for (const finish of ['pointerup', 'pointercancel']) {
        let updates = 0;
        const handle = document.createElement('div');
        document.body.append(handle);
        handle.addEventListener('pointerdown', e => {
            if (operation === 'resize') {
                pointer.resize(e, {
                    border: 'rb', objectLeft: 0, objectTop: 0,
                    objectWidth: 400, objectHeight: 300,
                    move: () => { ++updates; },
                });
            }
            else {
                pointer.move(e, { move: () => { ++updates; } });
            }
        });
        handle.dispatchEvent(event('pointerdown', 400, 300));
        await nextTick();
        assert.equal(state.move, true);
        assert.notEqual(mask.style.display, 'none');
        mask.dispatchEvent(event('pointermove', 350, 250));
        mask.dispatchEvent(event('pointermove', 320, 230));
        assert.equal(updates, 2);
        mask.dispatchEvent(event(finish, 320, 230));
        await nextTick();
        assert.equal(state.move, false);
        assert.equal(mask.style.display, 'none');
        mask.dispatchEvent(event('pointermove', 300, 200));
        assert.equal(updates, 2);
        assert.equal(host.querySelector('iframe'), iframe);
        handle.remove();
    }
}
app.unmount();
dom.window.close();
console.log('WEB drag/resize mask, pointerup/cancel cleanup and iframe preservation checks passed.');

// Run: node --experimental-vm-modules dist/abox/test/pop-max-size.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><style>.pop { max-width: 480px; max-height: 300px; }</style><div id="trigger"></div><div class="pop"></div>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'PointerEvent']) {
    Object.defineProperty(globalThis, name, {
        'configurable': true,
        'value': dom.window[name],
    });
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
Object.defineProperty(window, 'innerWidth', { 'configurable': true, 'value': 1024 });
Object.defineProperty(window, 'innerHeight', { 'configurable': true, 'writable': true, 'value': 768 });

let refreshSize;
const source = await readFile(new URL('../form/popup.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, { 'compilerOptions': { 'target': ts.ScriptTarget.ES2022, 'module': ts.ModuleKind.CommonJS } }).outputText, {
    exports, window, document, Element, HTMLElement, PointerEvent, getComputedStyle,
});
const popup = exports.createPopupRuntime({
    getElements: () => ({ popList: document.body }), getSysId: () => 'system',
    lDom: { findParentByData: () => null, watchSize: (_id, _pop, callback) => { refreshSize = callback; return true; }, unwatchSize() {}, watchPosition() { return false; }, unwatchPosition() {} },
    lTool: { sleep: () => Promise.resolve() }, changeFocus: async () => {},
});

const trigger = document.querySelector('#trigger');
const pop = document.querySelector('.pop');
popup.showPop(trigger, pop, 'v', { 'autoPosition': true });
await Promise.resolve();
assert.equal(pop.style.maxHeight, 'min(300px, 760px)', 'CSS max-height must survive the viewport limit');
assert.equal(pop.style.maxWidth, 'min(480px, 1016px)', 'CSS max-width must survive the viewport limit');

window.innerHeight = 240;
refreshSize();
assert.equal(pop.style.maxHeight, 'min(300px, 232px)', 'a smaller viewport must still constrain the popup');

pop.style.maxHeight = '180px';
refreshSize();
assert.equal(pop.style.maxHeight, 'min(180px, 232px)', 'an explicit inline limit must take effect');

pop.style.maxHeight = '';
refreshSize();
assert.equal(pop.style.maxHeight, 'min(300px, 232px)', 'removing an inline limit must restore the CSS limit');

dom.window.close();
console.log('Popup CSS limits, viewport limits, and inline overrides passed.');

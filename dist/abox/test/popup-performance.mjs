import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><div id="anchor"></div><div data-cg-pop id="pop"></div>');
const { window } = dom;
const { document, Element, HTMLElement } = window;
const anchor = document.querySelector('#anchor');
const pop = document.querySelector('#pop');
let rect = { left: 50, top: 50, right: 70, bottom: 70, width: 20, height: 20 };
anchor.getBoundingClientRect = () => rect;
Object.defineProperties(pop, { offsetWidth: { get: () => 100 }, offsetHeight: { get: () => 40 } });
let writes = 0, transitionWrites = 0, computedPop = 0, direction = 'ltr', now = 1000;
const proto = window.CSSStyleDeclaration.prototype;
for (const key of ['maxWidth', 'maxHeight', 'boxSizing', 'overflow', 'overscrollBehavior', 'width', 'height', 'left', 'top', 'zIndex', 'transition']) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (!descriptor?.set) continue;
    Object.defineProperty(proto, key, { ...descriptor, set(value) { if (this === pop.style) { ++writes; if (key === 'transition') ++transitionWrites; } descriptor.set.call(this, value); } });
}
let callback;
const exports = {};
const source = await readFile(new URL('../form/popup.ts', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, window, document, Element, HTMLElement, PointerEvent: window.MouseEvent,
    getComputedStyle(el) { if (el === anchor) return { direction }; ++computedPop; return window.getComputedStyle(el); }, Date: class extends Date { static now() { return now; } },
});
const runtime = exports.createPopupRuntime({
    getElements: () => ({ popList: document.body }), getSysId: () => 'sys',
    lDom: { findParentByData: () => null, watchSize(_id, _el, cb) { callback = cb; return true; }, unwatchSize() {}, watchPosition() { return false; }, unwatchPosition() {} },
    lTool: { sleep: () => Promise.resolve() }, changeFocus: async () => {},
});
runtime.showPop(anchor, pop, 'v', { autoPosition: true, size: { width: 100, height: 40 } });
await Promise.resolve();
assert.equal(pop.style.left, '50px');
writes = 0; computedPop = 0;
for (let i = 0; i < 1000; ++i) callback();
assert.equal(writes, 1000, 'unchanged updates write only zIndex, versus 10000 writes in the previous implementation');
assert.equal(computedPop, 0, 'unchanged limits do not read popup computed style');
rect = { left: 250, top: 80, right: 270, bottom: 100, width: 20, height: 20 };
callback();
assert.equal(pop.style.left, '250px');
direction = 'rtl'; callback();
assert.equal(pop.style.left, '170px', 'changed anchor geometry is applied');
rect = { left: 350, top: 80, right: 370, bottom: 100, width: 20, height: 20 };
callback();
assert.equal(pop.style.left, '270px', 'changed anchor geometry is applied');
pop.style.maxWidth = '80px'; pop.style.maxHeight = '30px';
computedPop = 0; callback();
assert.equal(computedPop, 1, 'both changed limits require only one computed style read');
assert.equal(pop.style.maxWidth, 'min(80px, 1016px)');
assert.equal(pop.style.maxHeight, 'min(30px, 760px)');
runtime.hidePop(pop);
rect = { left: 450, top: 80, right: 470, bottom: 100, width: 20, height: 20 };
now += 10;
transitionWrites = 0;
runtime.showPop(anchor, pop, 'v', { autoPosition: true });
await Promise.resolve();
assert.equal(pop.style.left, '370px');
assert.equal(transitionWrites, 2, 'reopening at a new position restarts the transition');
assert.equal(pop.hasAttribute('data-cg-open'), true);
runtime.cleanupPop(document.body);
assert.equal(pop.hasAttribute('data-cg-open'), false);
dom.window.close();
console.log('Popup refresh: 1000 unchanged updates, 1000 style writes (baseline 10000); dynamic RTL, geometry and limits passed.');

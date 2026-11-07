import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><div id="form"><button id="a"></button><button id="b"></button><div data-cg-pop id="pop"></div></div>');
const { window } = dom, { document, Element, HTMLElement } = window;
const pending = [];
const size = new Map(), positions = new Map();
const source = await readFile(new URL('../form/popup.ts', import.meta.url), 'utf8');
const exports = {};
const FakeDate = class extends Date { static now() { return now; } };
let now = 1000;
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, window, document, Element, HTMLElement, PointerEvent: window.MouseEvent,
    getComputedStyle: window.getComputedStyle.bind(window), Date: FakeDate,
});
const lDom = {
    findParentByData: () => null,
    watchSize(_id, el, cb) { if (size.has(el)) return false; size.set(el, cb); return true; },
    unwatchSize(el) { size.delete(el); },
    watchPosition(el, cb) { if (positions.has(el)) return false; positions.set(el, cb); return true; },
    unwatchPosition(el) { positions.delete(el); },
};
const popup = exports.createPopupRuntime({ getElements: () => ({ popList: document.body }), getSysId: () => 'sys', lDom,
    lTool: { sleep: delay => new Promise(resolve => pending.push({ delay, resolve })) }, changeFocus: async () => {} });
const form = document.querySelector('#form'), a = document.querySelector('#a'), b = document.querySelector('#b'), pop = document.querySelector('#pop');
a.getBoundingClientRect = () => ({ left: 10, top: 10, right: 30, bottom: 30, width: 20, height: 20 });
b.getBoundingClientRect = () => ({ left: 100, top: 10, right: 120, bottom: 30, width: 20, height: 20 });
async function drain(delay) { for (const item of pending.splice(0).filter(item => item.delay === delay)) item.resolve(); await Promise.resolve(); }
popup.showPop(a, pop, 'v', { autoPosition: true, autoScroll: true });
popup.hidePop(pop);
now += 10;
popup.showPop(b, pop, 'v', { autoPosition: true, autoScroll: true });
await drain(34);
assert.equal(pop.style.left, '100px', 'only the latest opening positions the popup');
assert.equal(size.size, 1);
assert.equal(positions.has(a), false);
assert.equal(positions.has(b), true);
popup.cleanupPop(form);
assert.equal(size.size, 0);
assert.equal(positions.size, 0);
assert.equal(pop.hasAttribute('data-cg-open'), false);
const externalSize = () => {}, externalPosition = () => {};
size.set(pop, externalSize); positions.set(a, externalPosition);
now += 10;
popup.showPop(a, pop, 'v', { autoPosition: true, autoScroll: true });
await drain(34);
popup.hidePop(pop);
assert.equal(size.get(pop), externalSize, 'cleanup preserves an existing size subscription');
assert.equal(positions.get(a), externalPosition, 'cleanup preserves an existing position subscription');
size.clear(); positions.clear();
now += 10;
popup.showPop(a, pop, 'v', { flow: false, autoPosition: true });
popup.cleanupPop(form);
await drain(34);
assert.equal(pop.hasAttribute('data-cg-open'), false, 'removed flow popup cannot reopen from pending callback');
assert.equal(size.size, 0);
dom.window.close();
console.log('Popup stale opening, listener ownership and form cleanup passed.');

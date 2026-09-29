// Run: node --experimental-vm-modules test/dom-style.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const documentDom = new JSDOM('<!doctype html><html><body></body></html>');
for (const name of ['window', 'document', 'HTMLElement', 'Element', 'Node']) {
    Object.defineProperty(globalThis, name, { 'configurable': true, 'value': documentDom.window[name] });
}
window.setTimeout = () => 0;
globalThis.ResizeObserver = class { observe() {} unobserve() {} };
globalThis.requestAnimationFrame = () => 0;
const values = new WeakMap();
const reads = [];
let computedCalls = 0;
globalThis.getComputedStyle = (el) => {
    ++computedCalls;
    return new Proxy({}, {
        get(_, name) {
            reads.push([el, name]);
            return values.get(el)?.[name] ?? '';
        },
    });
};
let focus = 'form-a';
let activePanels = [];
const formModule = new SyntheticModule(['getFocus', 'getActivePanel'], function() {
    this.setExport('getFocus', () => focus);
    this.setExport('getActivePanel', () => activePanels);
});
const emptyModule = new SyntheticModule([], function() {});
const source = await readFile(new URL('../dist/lib/dom.ts', import.meta.url), 'utf8');
const domModule = new SourceTextModule(ts.transpileModule(`${source}\nexport { watchTimerHandler };`, {
    'compilerOptions': { 'target': ts.ScriptTarget.ES2022, 'module': ts.ModuleKind.ESNext },
}).outputText);
await domModule.link((specifier) => specifier === './form' ? formModule : emptyModule);
await domModule.evaluate();
const api = domModule.namespace;
const tick = api.watchTimerHandler;
const formA = document.createElement('div');
formA.dataset.formId = 'form-a';
document.body.append(formA);
const formB = document.createElement('div');
formB.dataset.formId = 'form-b';
document.body.append(formB);

/** --- 创建有独立计算样式值的测试元素 --- */
function element(parent = formA, style = { 'font-size': '13px' }) {
    const el = document.createElement('div');
    parent.append(el);
    values.set(el, style);
    return el;
}
const events = [];
const first = element();
const second = element();
const firstHandler = (name, value, old) => {
    events.push(['first', name, value, old, reads.length]);
    values.get(second)['font-size'] = '30px';
};
api.watchStyle(first, 'font-size', firstHandler, true);
assert.deepEqual(events[0].slice(0, 4), ['first', 'font-size', '13px', '']);
values.get(second)['font-size'] = '13px';
api.watchStyle(second, 'font-size', (name, value, old) => {
    events.push(['second', name, value, old, reads.length]);
});
const extraEvents = [];
const extraHandler = (...args) => extraEvents.push(args);
const beforeCalls = computedCalls;
api.watchStyle(first, 'font-size', extraHandler);
assert.equal(computedCalls, beforeCalls, 'repeat registration reuses the live style object');
values.get(first)['font-size'] = '14px';
values.get(second)['font-size'] = '15px';
reads.length = 0;
events.length = 0;
tick();
assert.equal(reads.length, 2, 'each changed property is read once, including multiple subscribers');
assert.deepEqual(events.map(event => event.slice(0, 4)), [
    ['first', 'font-size', '14px', '13px'],
    ['second', 'font-size', '15px', '13px'],
]);
assert.ok(events.every(event => event[4] === 2), 'all style reads finish before any callback');
assert.deepEqual(extraEvents, [['font-size', '14px', '13px']]);
events.length = 0;
tick();
assert.deepEqual(events[0].slice(0, 4), ['second', 'font-size', '30px', '15px'], 'callback writes are detected in the following poll');
events.length = 0;
tick();
assert.equal(events.length, 0, 'unchanged values do not notify');
api.unwatchStyle(first, undefined, firstHandler);
values.get(first)['font-size'] = '16px';
tick();
assert.equal(events.length, 0, 'removing one callback preserves the other subscriber');
assert.deepEqual(extraEvents.at(-1), ['font-size', '16px', '14px']);
api.unwatchStyle(first);
assert.equal(api.isWatchStyle(first), false);
assert.equal(first.dataset.cgStyleindex, undefined);
api.unwatchStyle(second);

// Copied DOM attributes must never reuse another element's subscription.
const original = element();
api.watchStyle(original, 'font-size', () => {});
const copy = original.cloneNode();
formA.append(copy);
values.set(copy, { 'font-size': '20px' });
assert.equal(api.isWatchStyle(copy), false);
api.watchStyle(copy, 'font-size', () => {});
assert.notEqual(copy.dataset.cgStyleindex, original.dataset.cgStyleindex);
original.remove();
activePanels = ['nonexistent'];
tick();
assert.equal(api.isWatchStyle(original), false);
assert.equal(original.dataset.cgStyleindex, undefined);
formA.append(original);
api.watchStyle(original, 'font-size', () => {});
assert.equal(api.isWatchStyle(original), true, 'a detached and reinserted element can be registered again');
api.clearWatchStyle('form-a');
assert.equal(api.isWatchStyle(copy), false);
assert.equal(api.isWatchStyle(original), false);

// Keep focused Form and active Panel filtering, including delayed changes on activation.
const panel = document.createElement('div');
panel.dataset.panelId = 'panel-a';
formA.append(panel);
const main = element();
const panelItem = element(panel);
const otherFormItem = element(formB);
const scopedEvents = [];
for (const [label, el] of [['main', main], ['panel', panelItem], ['other', otherFormItem]]) {
    api.watchStyle(el, 'font-size', () => scopedEvents.push(label));
    values.get(el)['font-size'] = '18px';
}
activePanels = [];
tick();
assert.deepEqual(scopedEvents, ['main']);
activePanels = ['panel-a'];
tick();
assert.deepEqual(scopedEvents, ['main', 'panel']);
focus = 'form-b';
tick();
assert.deepEqual(scopedEvents, ['main', 'panel', 'other']);
api.clearWatchStyle('form-a', 'panel-a');
assert.equal(api.isWatchStyle(main), true);
assert.equal(api.isWatchStyle(panelItem), false);
api.clearWatchStyle('form-a');
api.clearWatchStyle('form-b');
focus = 'form-a';
activePanels = ['panel-a'];

// An earlier notification may cancel records already collected for this poll.
const cancelFirst = element();
const cancelSecond = element();
let cancelledCalls = 0;
api.watchStyle(cancelFirst, 'font-size', () => api.clearWatchStyle('form-a'));
api.watchStyle(cancelSecond, 'font-size', () => ++cancelledCalls);
values.get(cancelFirst)['font-size'] = '22px';
values.get(cancelSecond)['font-size'] = '22px';
tick();
assert.equal(cancelledCalls, 0, 'clearing a Form cancels queued notifications');
assert.equal(api.isWatchStyle(cancelSecond), false);

const named = element(formA, { 'font-size': '13px', 'font-family': 'sans-serif' });
api.watchStyle(named, ['font-size', 'font-family'], () => {});
api.unwatchStyle(named, 'font-size');
assert.equal(api.isWatchStyle(named), true);
assert.deepEqual(api.getWatchInfo().default.unknown.style.list, ['font-family']);
api.unwatchStyle(named, 'font-family');
assert.equal(api.isWatchStyle(named), false);

// Removing a later queued element also suppresses its notification and releases its index.
const removeFirst = element();
const removeSecond = element();
api.watchStyle(removeFirst, 'font-size', () => removeSecond.remove());
api.watchStyle(removeSecond, 'font-size', () => ++cancelledCalls);
values.get(removeFirst)['font-size'] = '19px';
values.get(removeSecond)['font-size'] = '19px';
tick();
assert.equal(cancelledCalls, 0);
assert.equal(api.isWatchStyle(removeSecond), false);
api.unwatchStyle(removeFirst);
const immediateCancel = element(formA, { 'font-size': '13px', 'font-family': 'sans-serif' });
const immediateNames = [];
api.watchStyle(immediateCancel, ['font-size', 'font-family'], name => {
    immediateNames.push(name);
    api.unwatchStyle(immediateCancel);
}, true);
assert.deepEqual(immediateNames, ['font-size']);
assert.equal(api.isWatchStyle(immediateCancel), false);

// Reentrant registration retains per-property subscription order and cancellation.
const reentrant = element();
let registeredCalls = 0;
const registered = () => ++registeredCalls;
api.watchStyle(reentrant, 'font-size', () => api.watchStyle(reentrant, 'font-size', registered));
values.get(reentrant)['font-size'] = '14px';
tick();
assert.equal(registeredCalls, 0, 'a callback registered during dispatch does not receive an old queued change');
values.get(reentrant)['font-size'] = '15px';
tick();
assert.equal(registeredCalls, 1);
api.unwatchStyle(reentrant);

// A failed subscriber must not discard collected changes or stop subsequent polls.
const failing = element();
const following = element();
const followingValues = [];
api.watchStyle(failing, 'font-size', () => { throw new Error('test subscriber failure'); });
api.watchStyle(following, 'font-size', (name, value) => followingValues.push(value));
values.get(failing)['font-size'] = '17px';
values.get(following)['font-size'] = '17px';
tick();
values.get(following)['font-size'] = '18px';
tick();
assert.deepEqual(followingValues, ['17px', '18px']);
api.clearWatchStyle('form-a');

// Stab coalesces repeated requests and discards pending measurements on unmount.
class AbstractControl {
    constructor() {
        this.element = element();
    }
    nextTick() { return Promise.resolve(); }
    watch(name, callback, options) { if (options?.immediate) callback(); }
}
const stopped = [];
const clickgoModule = new SyntheticModule(['control', 'dom'], function() {
    this.setExport('control', { AbstractControl });
    this.setExport('dom', {
        'watchSizeMulti': () => true,
        'unwatchSizeMulti': (...args) => stopped.push(args),
        'watchStyle': api.watchStyle,
        'unwatchStyle': api.unwatchStyle,
    });
});
const stabSource = await readFile(new URL('../dist/sources/control/stab/code.ts', import.meta.url), 'utf8');
const stabModule = new SourceTextModule(ts.transpileModule(stabSource, {
    'compilerOptions': { 'target': ts.ScriptTarget.ES2022, 'module': ts.ModuleKind.ESNext },
}).outputText);
await stabModule.link(() => clickgoModule);
await stabModule.evaluate();
const stab = new stabModule.namespace.default();
stab.props.type = 'rect';
let measurements = 0;
stab.resize = () => ++measurements;
stab.onMounted();
for (let i = 0; i < 9; ++i) stab.requestResize();
await Promise.resolve();
assert.equal(measurements, 1);
const unrelated = () => {};
api.watchStyle(stab.element, 'font-size', unrelated);
stab.requestResize();
stab.onBeforeUnmount();
await Promise.resolve();
assert.equal(measurements, 1, 'unmount cancels pending geometry measurement');
assert.equal(stopped.length, 1);
assert.equal(api.isWatchStyle(stab.element), true, 'unmount preserves unrelated style subscribers');
assert.deepEqual(api.getWatchInfo().default.unknown.style.list, ['font-size']);
api.unwatchStyle(stab.element);
console.log('Style read batching, callback order/cancellation, DOM identity, Form/Panel isolation and stab resize coalescing passed.');

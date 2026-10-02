import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><div id="notify"></div>');
const { document } = dom.window;
const notify = document.getElementById('notify');
Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetHeight', {
    get() { return Number(this.dataset.height ?? 96); },
});
const frames = [];
const timers = new Map();
const observed = new Set();
let timerId = 0;
let observerCallback;
let area = { left: 0, top: 0, width: 800, height: 600 };
const core = { config: { locale: 'en' }, getAvailArea: () => area };
const source = await readFile(new URL('../dist/lib/form.ts', import.meta.url), 'utf8');
const start = source.indexOf('let notifyId:');
const end = source.indexOf('export function appendToPop', start);
const api = {};
vm.runInNewContext(ts.transpileModule(source.slice(start, end), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, {
    exports: api, document, elements: { notify }, lCore: core,
    lTool: { lang: { getDirection: locale => locale === 'ar' ? 'rtl' : 'ltr' }, escapeHTML: value => value },
    window: { innerWidth: 800, innerHeight: 600, setTimeout: schedule },
    setTimeout: schedule, clearTimeout: id => timers.delete(id),
    requestAnimationFrame: cb => frames.push(cb),
    ResizeObserver: class {
        constructor(callback) { observerCallback = callback; }
        observe(el) { observed.add(el); }
        unobserve(el) { observed.delete(el); }
    },
});
function schedule(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; }
function frame() { frames.splice(0).forEach(callback => callback()); }
function remove() {
    for (const [id, timer] of [...timers]) {
        if (timer.delay === 100) { timers.delete(id); timer.callback(); }
    }
}
function position(el) { return [...el.style.transform.matchAll(/\((-?[\d.]+)px\)/g)].map(match => Number(match[1])); }
const firstId = api.notify({ title: 'Loading', content: 'Task', note: 'Start', timeout: 0 });
const first = notify.children[0];
area.height = 552; // Task bar appears before the enter frame.
api.refreshNotifyPosition();
frame();
assert.deepEqual(position(first), [-58, -10]);
const secondId = api.notify({ title: 'Loading', content: 'Demo', note: 'Start', timeout: 0 });
const second = notify.children[1];
frame();
assert.deepEqual(position(second), [-164, -10], 'notifications share the current task bar offset');
first.dataset.height = '128.5';
api.notifyContent(firstId, { note: 'Wrapped content' });
assert.deepEqual(position(second), [-196.5, -10], 'content growth uses actual fractional height');
first.dataset.height = '146';
observerCallback();
assert.deepEqual(position(second), [-214, -10], 'size observer also restacks notifications');
area = { left: 0, top: 0, width: 750, height: 600 };
api.refreshNotifyPosition();
assert.deepEqual(position(first), [-10, -60], 'right bar moves the existing stack left');
core.config.locale = 'ar';
area = { left: 50, top: 0, width: 750, height: 600 };
api.refreshNotifyPosition();
assert.deepEqual(position(first), [-10, 60], 'RTL avoids the left task bar');
area = { left: 0, top: 50, width: 800, height: 550 };
api.refreshNotifyPosition();
assert.deepEqual(position(first), [-10, 10], 'top bar does not push the bottom anchor');
api.hideNotify(firstId);
api.hideNotify(firstId);
assert.equal([...timers.values()].filter(timer => timer.delay === 100).length, 1, 'duplicate hides are idempotent');
remove();
assert.deepEqual(position(second), [-10, 10], 'removing a notification closes its space');
assert.equal(observed.has(first), false, 'removed notifications release size subscriptions');
api.hideNotify(secondId); remove();
const earlyId = api.notify({ content: 'Close before entering' });
api.hideNotify(earlyId); frame();
assert.equal(notify.children[0].style.opacity, '0', 'pending enter cannot resurrect a closing notification');
remove();
assert.equal(notify.children.length, 0);
assert.equal(observed.size, 0);
assert.equal(timers.size, 0, 'no auto-hide timer survives an early hide');
const next = api.notify({ content: 'Fresh stack' }); frame();
assert.deepEqual(position(notify.children[0]), [-10, 10], 'empty stack leaves no stale offsets');
api.hideNotify(next); remove();
dom.window.close();
console.log('Notify task bar appearance/movement, RTL, height changes, stacking and hide races passed.');

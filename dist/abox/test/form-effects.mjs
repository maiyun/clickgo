import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<div id="circular"></div><div id="rectangle"></div>');
const elements = { circular: window.document.getElementById('circular'), rectangle: window.document.getElementById('rectangle') };
const frames = [];
const exports = {};
const source = await readFile(new URL('../form/effects.ts', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, requestAnimationFrame: callback => frames.push(callback)
});
let area = { left: 10, top: 20, width: 600, height: 400 };
const runtime = exports.createEffectsRuntime({ getElements: () => elements, getAvailArea: () => area });
const drain = () => { while (frames.length) frames.shift()(); };
const expected = {
    lt: [10, 20, 300, 200], t: [10, 20, 600, 400], tr: [310, 20, 300, 200], r: [310, 20, 300, 400],
    rb: [310, 220, 300, 200], b: [10, 220, 600, 200], bl: [10, 220, 300, 200], l: [10, 20, 300, 400]
};
for (const [border, rect] of Object.entries(expected)) {
    const actual = runtime.getRectByBorder(border);
    assert.deepEqual([actual.left, actual.top, actual.width, actual.height], rect);
}
runtime.showRectangle(30, 40, 'r');
runtime.hideRectangle();
drain();
assert.equal(elements.rectangle.style.opacity, '0', 'pending entrance must not reveal a hidden rectangle');
assert.equal(elements.rectangle.dataset.ready, '0');
runtime.showRectangle(30, 40, 'l');
frames.shift()();
runtime.showRectangle(50, 60, 'r');
drain();
assert.equal(elements.rectangle.style.left, '320px');
assert.equal(elements.rectangle.style.width, '280px');
const mutations = [];
const observer = new window.MutationObserver(records => mutations.push(...records));
observer.observe(elements.rectangle, { attributes: true });
for (let i = 0; i < 1000; ++i) runtime.moveRectangle('r');
await Promise.resolve();
assert.equal(mutations.length, 0, 'repeated drag updates at the same geometry must not rewrite DOM attributes');
area = { ...area, width: 800 };
runtime.moveRectangle('r');
assert.equal(elements.rectangle.style.left, '420px', 'same snap direction still updates after viewport resizing');
assert.equal(elements.rectangle.style.width, '380px');
observer.disconnect();
runtime.showCircular(50, 60);
frames.shift()();
runtime.showCircular(200, 220);
drain();
assert.equal(elements.circular.style.left, '170px');
assert.equal(elements.circular.style.top, '190px');
assert.equal(elements.circular.style.opacity, '0');
console.log('Form effects: snap geometry, interrupted animations, latest coordinates, viewport changes and 1,000 redundant drag updates with zero DOM mutations passed.');

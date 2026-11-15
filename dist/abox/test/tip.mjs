import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const pending = new Map();
const calls = [];
let hover;
const target = {
    addEventListener(name, callback) { this[name] = callback; },
    removeEventListener(name, callback) { assert.equal(this[name], callback); delete this[name]; },
};
const span = { previousElementSibling: target, remove() {} };
const pop = { dataset: {} };
const clickgo = {
    control: { AbstractControl: class {
        constructor() { this.refs = { span, pop }; this.props = {}; }
        propBoolean(name) { return !!this.props[name]; }
    } },
    modules: { pointer: { hover(_event, options) { hover = options; options.enter(); } } },
    form: {
        showPop() { calls.push('show'); },
        hidePop() { calls.push('hide'); },
    },
    tool: { sleep(ms) { return new Promise(resolve => {
        if (!pending.has(ms)) pending.set(ms, []);
        pending.get(ms).push(resolve);
    }); } },
};
const source = await readFile(new URL('../../sources/control/tip/code.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports, require: () => clickgo });
const tip = new exports.default();
tip.onMounted();

function enter() {
    target.pointerenter({ type: 'pointerenter', currentTarget: target });
    return hover;
}
async function finish(ms) {
    const resolve = pending.get(ms).shift();
    assert.ok(resolve, `expected a ${ms} ms wait`);
    resolve();
    await Promise.resolve();
}

const first = enter();
first.leave();
const second = enter();
second.leave();
await finish(150);
assert.deepEqual(calls, ['show', 'show'], 'an earlier leave cannot shorten the current hide delay');
await finish(150);
assert.deepEqual(calls, ['show', 'show', 'hide']);

const third = enter();
third.leave();
tip.onUnmounted();
await finish(150);
assert.equal(calls.at(-1), 'show', 'unmount cancels pending hide work');
assert.equal(target.pointerenter, undefined);
assert.equal(target.pointerdown, undefined);
console.log('Tip rapid re-entry and unmount hide timing passed.');

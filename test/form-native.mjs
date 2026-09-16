// Run after TypeScript compilation: node --experimental-vm-modules test/form-native.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';

const listeners = {};
const minimums = [];
let ended = 0;
let cancelled = true;
class AbstractControl {
    constructor() {
        this.parent = { controlName: 'root', isNativeNoFrameFirst: true };
        this.formId = 'form';
        this.element = {};
        this.watches = {};
    }
    watch(name, callback, options) {
        this.watches[name] = callback;
        if (options?.immediate) { callback(); }
    }
    propInt(name) { return parseInt(this.props[name]); }
    propBoolean(name) { return Boolean(this.props[name]); }
    emit(name, event) {
        if (name === 'close') {
            assert.equal(event.detail.event, null);
            if (cancelled) { event.preventDefault(); }
        }
    }
}
const clickgo = new SyntheticModule(['control', 'native', 'dom', 'tool', 'task'], function() {
    this.setExport('control', { AbstractControl });
    this.setExport('native', {
        on(current, name, handler) { listeners[name] = handler; },
        async minSize(current, w, h) { minimums.push([w, h]); },
        async maximizable() {},
    });
    this.setExport('dom', { watchSize() {} });
    this.setExport('tool', { getBoolean: Boolean });
    this.setExport('task', { async end() { ++ended; } });
});
const mod = new SourceTextModule(await readFile(new URL('../dist/sources/control/form/code.js', import.meta.url), 'utf8'));
await mod.link(() => clickgo);
await mod.evaluate();
const Form = mod.namespace.default;
const form = new Form();
form.onMounted();
assert.deepEqual(minimums.at(-1), [200, 100]);
form.props.minWidth = '360';
form.watches.minWidth();
assert.deepEqual(minimums.at(-1), [360, 100]);
form.props.minHeight = 240;
form.watches.minHeight();
assert.deepEqual(minimums.at(-1), [360, 240]);
listeners['close-request']();
assert.equal(ended, 0);
cancelled = false;
listeners['close-request']();
assert.equal(ended, 1);
form.props.close = false;
listeners['close-request']();
assert.equal(ended, 1);

const web = new Form();
web.parent.isNativeNoFrameFirst = false;
const before = minimums.length;
web.onMounted();
assert.equal(minimums.length, before);
console.log('Form native minimum-size and cancellable close-event checks passed.');

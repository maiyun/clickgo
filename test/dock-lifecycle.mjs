// Run after TypeScript compilation: node --experimental-vm-modules test/dock-lifecycle.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';

const sizeWatches = [];
const sizeUnwatches = [];

class AbstractControl {
    constructor(rootForm, height) {
        this.rootForm = rootForm;
        this.refs = {
            'body': { 'clientHeight': height }
        };
    }

    watch(name, callback, options) {
        if ((name === 'expanded') && options?.immediate) {
            callback();
        }
    }

    async nextTick() {}

    propBoolean(name) {
        return Boolean(this.props[name]);
    }

    emit() {}
}

const clickgo = new SyntheticModule(['control', 'dom'], function() {
    this.setExport('control', { AbstractControl });
    this.setExport('dom', {
        watchSizeMulti(current, element, handler, immediate) {
            sizeWatches.push({ current, element, handler });
            if (immediate) {
                handler();
            }
            return true;
        },
        unwatchSizeMulti(current, element, handler) {
            sizeUnwatches.push({ current, element, handler });
        },
        watchSize(current, element, handler, immediate) {
            if (immediate) {
                handler();
            }
            return true;
        }
    });
});
const mod = new SourceTextModule(await readFile(new URL('../dist/sources/control/dock/code.js', import.meta.url), 'utf8'));
await mod.link(() => clickgo);
await mod.evaluate();
const Dock = mod.namespace.default;

const formA = { 'element': { 'isConnected': true, 'offsetWidth': 500 } };
const formB = { 'element': { 'isConnected': true, 'offsetWidth': 800 } };
const dockA1 = new Dock(formA, 300);
const dockA2 = new Dock(formA, 400);
const dockB = new Dock(formB, 500);

await dockA1.onMounted();
await dockA2.onMounted();
await dockB.onMounted();

assert.notEqual(dockA1.access, dockA2.access);
assert.notEqual(dockA1.access.formSizeWatch, dockA2.access.formSizeWatch);
assert.equal(dockA1.narrow, true);
assert.equal(dockA2.narrow, true);
assert.equal(dockB.narrow, false);
assert.equal(dockA1.floatAreaHeight, 300);
assert.equal(dockA2.floatAreaHeight, 400);
assert.equal(dockB.floatAreaHeight, 500);

dockB.toggleFloat(1);
dockA1.toggleFloat(2);
dockA2.toggleFloat(3);
assert.equal(dockA1.floatGroup, -1);
assert.equal(dockA2.floatGroup, 3);
assert.equal(dockB.floatGroup, 1);

const dockA1Watch = dockA1.access.formSizeWatch;
dockA1.onUnmounted();
assert.equal(dockA1.access.formSizeWatch, null);
assert.equal(sizeUnwatches.length, 1);
assert.equal(sizeUnwatches[0].current, dockA1);
assert.equal(sizeUnwatches[0].element, formA.element);
assert.equal(sizeUnwatches[0].handler, dockA1Watch.handler);
assert.equal(sizeWatches.length, 3);

console.log('Dock access state, Form isolation and size-watch cleanup checks passed.');

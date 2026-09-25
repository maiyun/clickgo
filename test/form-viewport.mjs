// Run: node test/form-viewport.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

let nativeMode = false;
const clickgo = {
    isNative: () => nativeMode,
    control: {
        AbstractControl: class {
            emit() {}
            propInt(name) { return Number(this.props[name]); }
            trigger() { return Promise.resolve(); }
        },
    },
    native: {
        restore: async () => {},
        size: async () => {},
    },
    tool: { sleep: () => Promise.resolve() },
};
const source = await readFile(new URL('../dist/sources/control/form/code.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, {
    exports, require: () => clickgo,
    window: { innerWidth: 640, innerHeight: 440 },
});
const Form = exports.default;

function restore(history, mode = 'web') {
    nativeMode = mode !== 'web';
    const form = new Form();
    form.isNativeNoFrameFirst = mode === 'native-frameless';
    form.stateMaxData = true;
    form.historyLocation = history;
    form.element = { style: {}, removeAttribute() {} };
    form.maxMethod();
    return [form.widthData, form.heightData, form.leftData, form.topData];
}

assert.deepEqual(restore({ width: 900, height: 700, left: 500, top: 300 }), [900, 700, 0, 0]);
assert.deepEqual(restore({ width: 400, height: 300, left: 500, top: 300 }), [400, 300, 240, 140]);
assert.deepEqual(restore({ width: 600, height: 40, left: 40, top: 400 }), [600, 40, 40, 400]);
assert.deepEqual(restore({ width: 900, height: 700, left: 500, top: 300 }, 'native-framed'), [900, 700, 500, 300]);
assert.deepEqual(restore({ width: 900, height: 700, left: 500, top: 300 }, 'native-frameless'), [900, 700, 500, 300]);
console.log('Form restore stays visible, edge-positioned Forms stay anchored, and Native geometry is unchanged.');

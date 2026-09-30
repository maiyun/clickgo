// Run: node test/form-viewport.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

let nativeMode = false;
let area = { left: 0, top: 0, width: 640, height: 400, owidth: 640, oheight: 440 };
const bool = value => value === true || value === '' || value === 'true';
const clickgo = {
    isNative: () => nativeMode,
    control: {
        AbstractControl: class {
            constructor() { this.rootForm = { bottomMost: false }; this.parent = { controlName: 'root' }; this.watches = {}; this.events = []; }
            emit(...event) { this.events.push(event); }
            propBoolean(name) { return bool(this.props[name]); }
            watch(name, callback, options) { this.watches[name] = callback; if(options?.immediate) callback(); }
            propInt(name) { return Number(this.props[name]); }
            trigger() { return Promise.resolve(); }
        },
    },
    core: { getAvailArea: () => area },
    dom: { watchSize() {} },
    native: {
        restore: async () => {},
        size: async () => {},
    },
    tool: { sleep: () => Promise.resolve(), getBoolean: bool },
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


nativeMode = false;
function create(viewport = false, initialMax = false) {
    const form = new Form();
    form.props.viewport = viewport;
    form.props.stateMax = initialMax;
    form.props.padding = 'safe';
    form.element = { style: {}, dataset: {}, offsetWidth: 300, offsetHeight: 200, removeAttribute() {} };
    form.onMounted();
    if (!initialMax) form.maxMethod();
    return form;
}
function rect(form) { return [form.leftData, form.topData, form.widthData, form.heightData]; }
const full = create(true, true);
assert.deepEqual(rect(full), [0, 0, 640, 440], 'initial state-max uses the full viewport');
const history = JSON.stringify(full.historyLocation);
for (const a of [
    { left: 0, top: 0, width: 640, height: 400, owidth: 640, oheight: 440, padding: '0px 0px 40px 0px' },
    { left: 60, top: 0, width: 580, height: 440, owidth: 640, oheight: 440, padding: '0px 0px 0px 60px' },
    { left: 0, top: 40, width: 640, height: 400, owidth: 640, oheight: 440, padding: '40px 0px 0px 0px' },
    { left: 0, top: 0, width: 580, height: 440, owidth: 640, oheight: 440, padding: '0px 60px 0px 0px' },
    { left: 0, top: 0, width: 800, height: 520, owidth: 800, oheight: 560, padding: '0px 0px 40px 0px' },
    { left: 0, top: 0, width: 800, height: 560, owidth: 800, oheight: 560, padding: '0px 0px 0px 0px' }
]) {
    area = a;
    full.refreshMaxPosition();
    assert.deepEqual(rect(full), [0, 0, a.owidth, a.oheight]);
    assert.equal(full.contentPadding, a.padding);
    assert.equal(JSON.stringify(full.historyLocation), history, 'refresh never overwrites restore geometry');
}
area = { left: 60, top: 0, width: 580, height: 440, owidth: 640, oheight: 440 };
full.props.viewport = false;
full.watches.viewport();
assert.deepEqual(rect(full), [60, 0, 580, 440]);
assert.equal(full.contentPadding, '0px 0px 0px 0px', 'available-area maximization does not reserve the taskbar twice');
full.props.viewport = 'true';
full.watches.viewport();
assert.deepEqual(rect(full), [0, 0, 640, 440]);
full.maxMethod();
assert.equal(full.contentPadding, undefined, 'safe padding is removed when restoring');
full.props.padding = '4 8';
assert.equal(full.contentPadding, '4px 8px', 'numeric padding is unchanged');
const normal = create();
assert.deepEqual(rect(normal), [60, 0, 580, 440], 'default maximization still avoids the taskbar');
const bottom = create();
bottom.rootForm.bottomMost = true;
bottom.refreshMaxPosition();
assert.deepEqual(rect(bottom), [60, 0, 580, 440], 'bottomMost alone does not change the layout boundary');
assert.equal(bottom.contentPadding, '0px 0px 0px 0px');
bottom.props.viewport = true;
bottom.watches.viewport();
assert.deepEqual(rect(bottom), [0, 0, 640, 440], 'bottomMost uses the full viewport only when explicitly enabled');
assert.equal(bottom.contentPadding, '0px 0px 0px 60px');
bottom.props.viewport = false;
bottom.watches.viewport();
assert.deepEqual(rect(bottom), [60, 0, 580, 440], 'disabling viewport also restores taskbar exclusion for bottomMost');
const inline = create();
inline.isInside = true;
const previous = rect(inline);
inline.props.viewport = true;
inline.refreshMaxPosition();
assert.deepEqual(rect(inline), previous, 'inline Forms do not resize to the viewport');
const automatic = create();
automatic.props.width = 0;
automatic.props.height = 0;
automatic.events = [];
automatic.refreshMaxPosition();
assert.ok(automatic.events.every(([name]) => !['update:width', 'update:height'].includes(name)));
console.log('Form viewport bounds, four taskbar edges, safe padding, live switching, restore and bottomMost layout independence passed.');

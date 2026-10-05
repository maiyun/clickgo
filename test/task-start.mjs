import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import JSZip from 'jszip';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../dist/sources/control/task-start/code.ts', import.meta.url), 'utf8');
const scope = {
    exports: {},
    require: () => ({ control: { AbstractControl: class {
        propBoolean(name) { return this.props[name] === true || this.props[name] === 'true' || this.props[name] === ''; }
        parentByName() { return this.taskParent; }
        watch(name, callback) { this.watched = callback; }
        emit(name) { this.events.push(name); }
    } } }),
};
vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, scope);
const start = new scope.exports.default();
start.events = [];
let nativeClicks = 0;
// --- 原生 click 不会触发框架转换后的 tap 监听，键盘必须直接发送控件事件。 ---
start.element = { click: () => ++nativeClicks };
const key = (value, extra = {}) => ({ key: value, preventDefault() {}, stopPropagation() {}, ...extra });
assert.equal(start.labelMode, 'auto');
start.props.showLabel = 'false';
assert.equal(start.labelMode, 'hide');
start.props.showLabel = true;
assert.equal(start.labelMode, 'show');
start.taskParent = { position: 'right', mode: 'dock' };
assert.equal(start.position, 'right');
assert.equal(start.mode, 'dock');
start.keydown(key(' '));
assert.equal(start.isSpaceDown, true);
assert.equal(start.events.length, 0, 'Space activates on release');
start.keydown(key(' ', { repeat: true }));
start.keyup(key(' '));
start.keyup(key(' '));
assert.deepEqual(start.events, ['tap']);
start.props.opened = true;
start.keydown(key('Enter'));
start.keydown(key('Enter', { repeat: true }));
assert.equal(start.events.length, 2, 'held Enter does not repeatedly activate');
assert.equal(start.props.opened, true, 'activation does not overwrite the caller-owned menu state');
start.keydown(key('Enter', { isComposing: true }));
start.onMounted();
start.keydown(key(' '));
start.props.disabled = true;
start.watched();
assert.equal(start.isSpaceDown, false);
start.keyup(key(' '));
start.keydown(key('Enter'));
start.click({ stopPropagation() {} });
assert.equal(start.events.length, 2, 'disabled controls never activate');
assert.equal(nativeClicks, 0, 'keyboard activation does not depend on a native click reaching a tap listener');

// --- 使用真实 Vue、Pointer.js 与框架事件转换，验证 @click 不丢失键盘或重复指针激活。 ---
const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'Event', 'CustomEvent']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
const vue = await import('vue');
const pointer = await import('../node_modules/@litert/pointer/dist/index.esm.js');
const toolSource = await readFile(new URL('../dist/lib/tool.ts', import.meta.url), 'utf8');
const toolTree = ts.createSourceFile('tool.ts', toolSource, ts.ScriptTarget.ES2022, true);
const wrapSource = toolTree.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'eventsAttrWrap').getText(toolTree);
const toolScope = { exports: {} };
vm.runInNewContext(ts.transpileModule(wrapSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, toolScope);
const prepare = layout => toolScope.exports.eventsAttrWrap(layout).replaceAll('@click="', '@tap="');
const methods = {};
const computed = {};
for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(start))) {
    if (name === 'constructor') continue;
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(start), name);
    if (descriptor.value) methods[name] = descriptor.value;
    else if (descriptor.get) computed[name] = descriptor.get;
}
methods.propBoolean = function(name) { return pointerBoolean(this.props[name]); };
function pointerBoolean(value) { return value === true || value === 'true' || value === ''; }
methods.parentByName = () => null;
methods.emit = function(name, event) { this.$emit(name, event); };
methods.allowEvent = pointer.allowEvent;
const layout = await readFile(new URL('../dist/sources/control/task-start/layout.html', import.meta.url), 'utf8');
const component = {
    template: prepare(layout), props: Object.fromEntries(Object.entries(start.props).map(([name, value]) => [name, { default: value }])),
    components: { 'cg-img': { template: '<img>' } },
    emits: start.emits, methods, computed,
    data: () => ({ isSpaceDown: false, props: {}, element: null }),
    created() { this.props = this.$props; }, mounted() { this.element = this.$el; },
};
const app = vue.createApp({
    template: prepare('<task-start label="Start" :opened="opened" :disabled="disabled" @click="count++; opened = !opened"></task-start>'),
    components: { 'task-start': component }, methods: { allowEvent: pointer.allowEvent },
    data: () => ({ count: 0, opened: false, disabled: false }),
});
const root = app.mount('#app');
const button = document.querySelector('[role="button"]');
const keyboard = (type, key) => button.dispatchEvent(new window.KeyboardEvent(type, { key, bubbles: true, cancelable: true }));
keyboard('keydown', 'Enter');
await vue.nextTick();
assert.equal(root.count, 1);
assert.equal(button.getAttribute('aria-expanded'), 'true');
keyboard('keydown', ' ');
await vue.nextTick();
assert.equal(root.count, 1);
assert.ok(button.classList.contains('active'));
keyboard('keyup', ' ');
await vue.nextTick();
assert.equal(root.count, 2);
assert.equal(button.getAttribute('aria-expanded'), 'false');
function pointerEvent(type) {
    const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, clientX: 10, clientY: 10, button: 0, view: window });
    Object.defineProperties(event, { pointerId: { value: 1 }, pointerType: { value: 'mouse' } });
    button.dispatchEvent(event);
}
pointerEvent('pointerdown');
pointerEvent('pointerup');
await vue.nextTick();
assert.equal(root.count, 3, 'pointer tap invokes the caller exactly once');
root.disabled = true;
await vue.nextTick();
keyboard('keydown', 'Enter');
pointerEvent('pointerdown');
pointerEvent('pointerup');
assert.equal(root.count, 3);
assert.equal(button.getAttribute('tabindex'), null);
app.unmount();
dom.window.close();

// --- 检查真实 task 包包含新控件，避免源码存在但用户无法加载。 ---
const archive = await JSZip.loadAsync(await readFile(new URL('../dist/control/task.cgc', import.meta.url)));
for (const file of ['config.json', 'code.js', 'layout.html', 'style.css']) {
    assert.ok(archive.file(`task-start/${file}`), `task.cgc contains task-start/${file}`);
}
assert.equal(await archive.file('task-start/layout.html').async('string'),
    (await readFile(new URL('../dist/sources/control/task-start/layout.html', import.meta.url), 'utf8')).replace(/>\s+</g, '><').trim());
console.log('Task start caller-owned state, label override, bar/dock, keyboard, disabled and package loading passed.');

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
import { clone, getClassPrototype } from '../dist/lib/tool.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
const { createApp, h, nextTick, reactive } = await import('vue');
const errors = [];
const editors = [];
const menus = [];
let popCount = 0;
let moduleCount = 0;
let loadModule;

class AbstractControl {
    get refs() { return this.$refs; }
    get locale() { return 'en'; }
    watch(name, callback, options) { return this.$watch(() => this.props[name], callback, options); }
    emit(...args) { this.$emit(...args); }
    propBoolean(name) { return this.props[name] === true; }
}
const module = {
    make(element, options) {
        assert.ok(element instanceof HTMLElement && element.isConnected, 'Jodit requires a live host');
        const callbacks = {};
        const editor = {
            value: '', text: 'plain text', container: element.parentElement,
            options, callbacks, commands: [], images: [], destructCount: 0,
            events: { on(name, callback) { callbacks[name] = callback; } },
            setReadOnly(value) { this.readonly = value; },
            execCommand(value) { this.commands.push(value); },
            selection: { insertImage(...args) { editor.images.push(args); } },
            destruct() {
                assert.equal(element.isConnected, true, 'release the editor before Vue removes its DOM');
                ++this.destructCount;
                callbacks.change?.();
            },
        };
        editors.push(editor);
        return editor;
    },
};
const clickgo = {
    control: { AbstractControl },
    core: { getModule() { ++moduleCount; return loadModule(); } },
    dom: { findParentByClass() { return null; } },
    form: { hidePop() {}, showPop() { ++popCount; } },
    modules: { pointer: { menu(event, callback) { menus.push(callback); } } },
};
const source = await readFile(new URL('../dist/sources/control/jodit/code.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports, require: () => clickgo, HTMLElement });
const instance = new exports.default();
const prototype = getClassPrototype(instance);
const controls = [];
const Control = {
    template: '<div><div ref="content"><textarea ref="editor"></textarea><div class="jodit-workplace"></div></div><div ref="pop"></div></div>',
    props: Object.fromEntries(Object.entries(instance.props).map(([name, value]) => [name, {
        default: () => clone(value),
    }])),
    emits: instance.emits,
    data: () => Object.fromEntries(Object.entries(new exports.default()).filter(([name]) =>
        !['props', 'emits', 'access'].includes(name))),
    computed: prototype.access,
    methods: prototype.method,
    created() {
        this.props = this.$props;
        this.access = clone(instance.access);
        controls.push(this);
    },
    // Mirror buildComponents: its mounted hook defers the control hook by one Vue tick.
    async mounted() { await this.$nextTick(); await this.onMounted(); },
    beforeUnmount: prototype.method.onBeforeUnmount,
};

/** --- Drain both Vue mounting and asynchronous module continuations. --- */
async function flush() {
    for (let i = 0; i < 8; ++i) await nextTick();
    assert.deepEqual(errors, [], 'Jodit lifecycle must not produce runtime errors');
}

/** --- Mount independent instances with the framework's per-instance access storage. --- */
function mount(items) {
    const state = reactive({ items });
    const events = [];
    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp({
        render: () => h('div', state.items.map(item => h(Control, {
            key: item.id,
            modelValue: item.value ?? '', readonly: item.readonly ?? false,
            'onUpdate:modelValue': value => events.push(['value', value]),
            onText: value => events.push(['text', value]),
            onInit: editor => events.push(['init', editor]),
            onImgselect: callback => events.push(['image', callback]),
        }))),
    });
    app.config.errorHandler = error => errors.push(error);
    app.mount(host);
    return { state, events, host, unmount() { app.unmount(); host.remove(); } };
}

// A parent can replace the temporary editor before the deferred control hook even starts.
loadModule = () => Promise.resolve(module);
let view = mount([{ id: 'temporary' }]);
view.state.items = [];
await flush();
assert.equal(moduleCount, 0);
assert.equal(editors.length, 0);
view.unmount();

// Module resolution after unmount must neither initialize Jodit nor change fallback state.
for (const result of [module, null]) {
    let release;
    loadModule = () => new Promise(resolve => { release = resolve; });
    view = mount([{ id: 'pending' }]);
    await flush();
    const control = controls.at(-1);
    view.state.items = [];
    await flush();
    release(result);
    await flush();
    assert.equal(editors.length, 0);
    assert.equal(control.notInit, false);
    assert.deepEqual(view.events, []);
    view.unmount();
}

// Re-rendering one editor while a shared module loads must preserve its surviving sibling.
let release;
const pending = new Promise(resolve => { release = resolve; });
loadModule = () => pending;
view = mount([{ id: 'temporary' }, { id: 'live', value: 'before' }]);
await flush();
const removed = controls.at(-2);
const live = controls.at(-1);
assert.notEqual(removed.access, live.access);
view.state.items.splice(0, 1);
view.state.items[0].value = 'after';
view.state.items[0].readonly = true;
await flush();
release(module);
await flush();
assert.equal(editors.length, 1);
const editor = editors[0];
assert.equal(live.access.editor, editor);
assert.equal(editor.value, 'after');
assert.equal(editor.readonly, true);
view.state.items[0].value = 'updated';
view.state.items[0].readonly = false;
await flush();
assert.equal(editor.value, 'updated');
assert.equal(editor.readonly, false);
editor.callbacks.change();
assert.ok(view.events.some(event => event[0] === 'value' && event[1] === 'updated'));
editor.callbacks.focus();
assert.equal(live.isFocus, true);
editor.callbacks.blur();
assert.equal(live.isFocus, false);
live.execCmd('copy');
assert.deepEqual(editor.commands, ['copy']);
editor.options.extraButtons[0].exec();
const insertImage = view.events.find(event => event[0] === 'image')[1];
const workplace = view.host.querySelector('.jodit-workplace');
workplace.dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
assert.equal(menus.length, 1);
const eventCount = view.events.length;
view.unmount();
await flush();
assert.equal(editor.destructCount, 1);
assert.equal(live.access.editor, undefined);
assert.equal(view.events.length, eventCount, 'destruction must not emit a model update');
insertImage('image.png');
menus[0]();
workplace.dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
live.execCmd('paste');
live.onBeforeUnmount();
assert.equal(editor.destructCount, 1, 'cleanup is idempotent');
assert.deepEqual(editor.images, []);
assert.equal(popCount, 0);
assert.equal(menus.length, 1, 'remove the menu listener at unmount');

// A cached module still resolves asynchronously on every later entry.
loadModule = async () => { await Promise.resolve(); return module; };
for (let i = 0; i < 20; ++i) {
    view = mount([{ id: 'entry', value: `entry ${i}` }]);
    await flush();
    view.state.items = [{ id: 'replacement', value: `replacement ${i}` }];
    await flush();
    view.unmount();
    await flush();
}
assert.equal(editors.length, 41);
assert.ok(editors.every(item => item.destructCount === 1));

// A genuine module load failure still displays the existing fallback.
loadModule = () => Promise.resolve(null);
view = mount([{ id: 'failure' }]);
await flush();
assert.equal(controls.at(-1).notInit, true);
assert.equal(controls.at(-1).isLoading, false);
view.unmount();
await flush();
dom.window.close();
console.log('Jodit deferred mounting, late module resolution, instance isolation, repeated entry and editor cleanup passed.');

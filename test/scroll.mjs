import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
import { getClassPrototype, lang } from '../dist/lib/tool.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
const { createApp, reactive, nextTick, h } = await import('vue');
const style = document.createElement('style');
style.textContent = await readFile(new URL('../dist/sources/control/scroll/style.css', import.meta.url), 'utf8');
document.head.append(style);
const state = reactive({ locale: 'en', direction: 'h', length: 1000, client: 200, offset: 250 });
const errors = [];
const watchers = [];
const rolls = [];
const frames = new Set();
process.on('unhandledRejection', error => { errors.push(error); });
HTMLElement.prototype.getBoundingClientRect = function() {
    const length = this.classList.contains('bar') ? 400 : 460;
    return { width: state.direction === 'h' ? length : 30, height: state.direction === 'v' ? length : 30, left: 0, top: 0 };
};

// Retain ClickGo's computed $el getter to exercise the real first-render order.
class AbstractControl {
    get element() { return this.$el; }
    get refs() { return this.$refs; }
    get locale() { return state.locale; }
    get localeDirection() { return lang.getDirection(this.locale); }
    watch(...args) { return this.$watch(...args); }
    emit(...args) { this.$emit(...args); }
    propInt(name) { return parseInt(this.props[name]); }
    propBoolean(name) { return this.props[name] === true || this.props[name] === 'true'; }
}
const clickgo = {
    control: { AbstractControl },
    dom: {
        isRtl: el => el instanceof Element && dom.window.getComputedStyle(el).direction === 'rtl',
        watchSize: (control, el, callback, immediate) => {
            assert.ok(el instanceof HTMLElement && el.isConnected);
            watchers.push(callback);
            if (immediate) callback();
        },
    },
    modules: { pointer: {
        hover() {},
        down: (event, options) => { options.down(); options.up(); },
    } },
    task: {
        onFrame: (control, callback) => { callback(); frames.add(1); return 1; },
        offFrame: (control, id) => { frames.delete(id); },
    },
};
const source = await readFile(new URL('../dist/sources/control/scroll/code.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports, require: () => clickgo });
const instance = new exports.default();
const prototype = getClassPrototype(instance);
const Scroll = {
    template: await readFile(new URL('../dist/sources/control/scroll/layout.html', import.meta.url), 'utf8'),
    props: Object.fromEntries(Object.entries(instance.props).map(([name, value]) => [name, { default: value }])),
    emits: instance.emits,
    data: () => Object.fromEntries(Object.entries(instance).filter(([name]) => !['props', 'emits'].includes(name))),
    computed: prototype.access,
    methods: prototype.method,
    created() { this.props = this.$props; },
    async mounted() { await this.$nextTick(); this.onMounted(); },
};
const host = document.createElement('div');
document.body.append(host);
const app = createApp({
    render() {
        return h('div', { dir: lang.getDirection(state.locale) }, [h(Scroll, {
            ref: 'scroll', direction: state.direction, length: state.length, client: state.client, offset: state.offset,
            'onUpdate:offset': offset => { state.offset = offset; },
            onRoll: () => { rolls.push(state.offset); },
        })]);
    },
});
app.config.errorHandler = error => { errors.push(error); };
const root = app.mount(host);

/** --- Drain render, mounted watchers and reactive updates. --- */
async function flush() {
    for (let i = 0; i < 10; ++i) await nextTick();
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(errors, [], 'Scroll must mount/update without runtime errors');
}
await flush();
const scroll = root.$refs.scroll;
assert.equal(scroll.element, host.querySelector('.wrap'));
assert.equal(scroll.barPx, 400);
assert.equal(scroll.blockPx, 80);
assert.equal(host.querySelector('.start').style.width, '30px');
assert.equal(host.querySelector('.end').style.width, '30px');
assert.equal(scroll.offsetPx, 100);
assert.match(host.querySelector('.block').style.transform, /translate3d\(100px, 0, 0\)/);
host.querySelector('.end').dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
await flush();
assert.equal(state.offset, 260);
assert.equal(rolls.length, 1);
assert.equal(frames.size, 0, 'pointer release stops the frame timer');
state.locale = 'ar';
await flush();
assert.equal(scroll.isRtl, true);
assert.equal(scroll.offsetPx, 216);
assert.equal(dom.window.getComputedStyle(host.querySelector('.bar')).direction, 'ltr',
    'the track must use a left origin for the physical translateX coordinate');
host.querySelector('.start').dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
await flush();
assert.equal(state.offset, 250);
assert.equal(scroll.offsetPx, 220);
state.direction = 'v';
await flush();
watchers[0]();
await flush();
assert.equal(scroll.isRtl, false);
assert.equal(host.querySelector('.start').style.height, '30px');
assert.equal(host.querySelector('.start').style.width, '');
assert.match(host.querySelector('.block').style.transform, /translate3d\(0, 100px, 0\)/);
state.direction = 'h';
state.locale = 'en';
await flush();
watchers[0]();
await flush();
assert.equal(host.querySelector('.end').style.width, '30px');
assert.equal(scroll.offsetPx, 100);
state.length = 300;
await flush();
assert.equal(state.offset, 100, 'shrinking the range clamps the offset');
state.client = 400;
await flush();
assert.equal(state.offset, 0);
assert.equal(host.querySelector('.wrap').getAttribute('data-cg-disabled'), '');
host.querySelector('.end').dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
await flush();
assert.equal(state.offset, 0);
app.unmount();
await flush();
console.log('Scroll real Vue mount, arrow sizes/events, range changes and live RTL/direction switching passed.');

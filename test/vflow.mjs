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
Object.defineProperties(HTMLElement.prototype, {
    offsetWidth: { configurable: true, get: () => 80 },
    offsetHeight: { configurable: true, get: () => 20 },
});
const { createApp, reactive, nextTick, h } = await import('vue');
const state = reactive({ locale: 'en', direction: 'h', count: 2 });
const errors = [];
const watched = [];
process.on('unhandledRejection', error => { errors.push(error); });

// Keep the framework's computed $el access and component-root mounting order.
class AbstractControl {
    get element() { return this.$el; }
    get locale() { return state.locale; }
    get localeDirection() { return lang.getDirection(this.locale); }
    nextTick() { return this.$nextTick(); }
    watch(...args) { return this.$watch(...args); }
    emit(...args) { this.$emit(...args); }
    propInt(name) { return parseInt(this.props[name]); }
}
const clickgo = {
    control: { AbstractControl },
    dom: {
        isRtl: el => el instanceof Element && dom.window.getComputedStyle(el).direction === 'rtl',
        watchStyle: (el, names, callback, immediate) => {
            assert.ok(el instanceof HTMLElement && el.isConnected, 'style watcher needs a mounted element');
            watched.push(el);
            if (immediate) {
                for (const name of names) callback(name, name === 'font' ? '13px sans-serif' : '0px');
            }
        },
        watchSize() {},
        unwatchSize() {},
    },
};
const source = await readFile(new URL('../dist/sources/control/vflow/code.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports, require: () => clickgo });
const instance = new exports.default();
const prototype = getClassPrototype(instance);
const layout = await readFile(new URL('../dist/sources/control/vflow/layout.html', import.meta.url), 'utf8');
const Flow = {
    template: '<div><slot /></div>',
    mounted() { this.$emit('clientwidth', 200); this.$emit('clientheight', 100); },
};
const Vflow = {
    template: layout,
    components: { 'cg-flow': Flow },
    props: Object.fromEntries(Object.entries(instance.props).map(([name, value]) => [name, {
        default: () => structuredClone(value),
    }])),
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
        return h('div', { dir: lang.getDirection(state.locale) }, [
            h(Vflow, { ref: 'flow', data: state.count, direction: state.direction }, {
                default: item => h('span', `Line ${item.row}`),
            }),
        ]);
    },
});
app.config.errorHandler = error => { errors.push(error); };
const root = app.mount(host);

/** --- Drain Vue render, mount and deferred item-size work. --- */
async function flush() {
    for (let i = 0; i < 10; ++i) await nextTick();
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(errors, [], 'Vflow must mount/update without runtime errors');
}
await flush();
assert.equal(watched.length, 1);
assert.equal(root.$refs.flow.element, host.querySelector('[direction]'));
assert.equal(root.$refs.flow.length, 160);
assert.equal(root.$refs.flow.isRtl, false);
assert.equal(host.querySelector('.item').style.left, '0px');
state.count = 102;
await flush();
assert.equal(root.$refs.flow.pos.length, 102);
assert.ok(host.querySelectorAll('.item').length < 102, 'only visible items are rendered');
state.locale = 'ar';
await flush();
assert.equal(root.$refs.flow.isRtl, true);
assert.equal(host.querySelector('.item').style.left, '');
assert.equal(host.querySelector('.item').style.right, '0px');
state.direction = 'v';
await flush();
assert.equal(root.$refs.flow.isRtl, false);
assert.equal(root.$refs.flow.length, 2040);
state.count = 0;
await flush();
assert.equal(root.$refs.flow.pos.length, 0);
state.count = 2;
state.direction = 'h';
state.locale = 'en';
await flush();
assert.equal(root.$refs.flow.length, 160);
assert.equal(host.querySelector('.item').style.left, '0px');
app.unmount();
await flush();
console.log('Vflow real Vue mount, virtualization, data/direction updates and live RTL switching passed.');

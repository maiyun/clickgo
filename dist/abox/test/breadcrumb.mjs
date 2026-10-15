import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test/workspace' });
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) {
    globalThis[name] = dom.window[name];
}
const vue = await import('vue');
const instances = [];
const parentKey = Symbol('breadcrumb');

class AbstractControl {
    propBoolean(name) { return this.props[name] === true || this.props[name] === 'true'; }
}

async function component(name) {
    const directory = new URL(`../../sources/control/${name}/`, import.meta.url);
    const source = await readFile(new URL('code.ts', directory), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const module = { exports: {} };
    new Function('require', 'module', 'exports', compiled)(() => ({ control: { AbstractControl } }), module, module.exports);
    const Control = module.exports.default;
    const defaults = new Control().props;
    const props = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, { default: value }]));
    const template = await readFile(new URL('layout.html', directory), 'utf8');
    return {
        props,
        emits: ['select'],
        setup(properties, context) {
            const control = new Control();
            control.access && vue.markRaw(control.access);
            const state = vue.reactive(control);
            const instance = vue.getCurrentInstance();
            const parent = vue.inject(parentKey, null);
            const exposed = {};
            for (const key of Object.keys(control)) {
                if (key === 'props' || key === 'emits') { continue; }
                Object.defineProperty(exposed, key, {
                    enumerable: true, get: () => state[key], set: value => { state[key] = value; },
                });
            }
            Object.defineProperties(exposed, {
                props: { get: () => properties },
                refs: { get: () => instance.refs },
                element: { get: () => instance.proxy.$el },
                formFocus: { get: () => true },
            });
            for (const key of Object.keys(defaults)) {
                Object.defineProperty(exposed, key, { enumerable: true, get: () => properties[key] });
            }
            for (let prototype = Control.prototype; prototype !== Object.prototype; prototype = Object.getPrototypeOf(prototype)) {
                for (const key of Object.getOwnPropertyNames(prototype)) {
                    if (key === 'constructor' || Object.hasOwn(exposed, key)) { continue; }
                    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
                    if (descriptor.get) {
                        const value = vue.computed(() => descriptor.get.call(exposed));
                        Object.defineProperty(exposed, key, { enumerable: true, get: () => value.value });
                    }
                    else if (typeof descriptor.value === 'function') {
                        exposed[key] = (...args) => descriptor.value.apply(exposed, args);
                    }
                }
            }
            exposed.emit = (event, value) => context.emit(event, value);
            exposed.parentByName = target => target === 'breadcrumb' ? parent : null;
            vue.markRaw(exposed);
            if (name === 'breadcrumb') { vue.provide(parentKey, exposed); }
            exposed.onCreated?.();
            vue.onMounted(async () => { await vue.nextTick(); exposed.onMounted?.(); });
            vue.onUpdated(async () => { await vue.nextTick(); exposed.onUpdated?.(); });
            vue.onBeforeUpdate(() => exposed.onBeforeUpdate?.());
            vue.onBeforeUnmount(() => exposed.onBeforeUnmount?.());
            instances.push({ name, control: exposed });
            return exposed;
        },
        render: vue.compile(template),
    };
}

const Breadcrumb = await component('breadcrumb');
const BreadcrumbItem = await component('breadcrumb-item');
const flush = async () => { for (let index = 0; index < 5; ++index) { await vue.nextTick(); } };
const state = vue.reactive({
    items: [
        { name: 'home', label: 'Home' },
        { name: 'orders', label: 'Orders' },
        { name: 'detail', label: 'Details' },
    ],
    disabled: false,
    separator: '/',
});
const parentEvents = [];
const itemEvents = [];
const host = document.createElement('div');
document.body.append(host);
const app = vue.createApp({
    render: () => vue.h(Breadcrumb, {
        label: 'Test navigation', separator: state.separator, disabled: state.disabled,
        onSelect: event => parentEvents.push(event),
    }, {
        default: () => state.items.map(item => vue.h(BreadcrumbItem, {
            ...item, key: item.name, onSelect: event => itemEvents.push(event),
        }, item.name === 'home' ? { default: () => vue.h('strong', 'Custom home') } : undefined)),
    }),
});
app.component('cg-svg', { props: ['src'], render() { return vue.h('svg', { 'data-src': this.src }); } });
app.component('cg-img', { props: ['src'], render() { return vue.h('img', { src: this.src }); } });
app.mount(host);
await flush();

const root = instances.find(item => item.name === 'breadcrumb').control;
const itemControls = () => instances.filter(item => item.name === 'breadcrumb-item').map(item => item.control);
const rows = () => [...host.querySelectorAll('ol > li')];
const current = () => host.querySelector('[aria-current="page"]');
assert.equal(host.querySelector('nav').getAttribute('aria-label'), 'Test navigation');
assert.equal(current().textContent.trim(), 'Details');
assert.equal(rows().at(-1).querySelector('button'), null, 'Current location must not be interactive');
assert.equal(host.querySelectorAll('.separator').length, 2);
assert.equal(host.querySelectorAll('.separator[aria-hidden="true"]').length, 2);
assert.equal(rows()[0].querySelector('strong').textContent, 'Custom home');
assert.equal(rows()[0].querySelector('button').getAttribute('tabindex'), '0');
rows()[1].querySelector('button').click();
assert.deepEqual(parentEvents.map(event => event.detail), [{ name: 'orders', index: 1 }]);
assert.equal(itemEvents.length, 1);
assert.equal(itemEvents[0], parentEvents[0], 'Item and parent must receive the same notification exactly once');
assert.equal(window.location.href, 'https://example.test/workspace', 'The control must leave routing to the application');
current().click();
assert.equal(parentEvents.length, 1);

const action = rows()[0].querySelector('button');
action.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
assert.equal(parentEvents.length, 2, 'Enter activates a history item exactly once');
action.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', repeat: true, cancelable: true }));
assert.equal(parentEvents.length, 2, 'Holding Enter must not produce repeated activation');
action.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', cancelable: true }));
assert.equal(parentEvents.length, 2, 'Space waits for key release');
action.dispatchEvent(new window.KeyboardEvent('keyup', { key: ' ', cancelable: true }));
assert.equal(parentEvents.length, 3);
action.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', cancelable: true }));
action.dispatchEvent(new window.FocusEvent('blur'));
action.dispatchEvent(new window.KeyboardEvent('keyup', { key: ' ', cancelable: true }));
assert.equal(parentEvents.length, 3, 'Losing focus cancels pending Space activation');

state.items[1].disabled = true;
await flush();
assert.equal(rows()[1].querySelector('button').disabled, true);
rows()[1].querySelector('button').click();
itemControls().find(item => item.props.name === 'orders').select();
assert.equal(parentEvents.length, 3, 'Disabled items must reject native and programmatic activation');
state.items[1].disabled = false;
state.disabled = true;
await flush();
assert.equal(rows().slice(0, -1).every(row => row.querySelector('button').disabled), true);
assert.equal(rows()[0].querySelector('button').getAttribute('tabindex'), '-1');
itemControls()[0].select();
assert.equal(parentEvents.length, 3, 'Parent disabled state must guard item activation');
state.disabled = false;

state.separator = '›';
state.items[0].icon = '/home.SVG';
state.items[1].label = 'All orders';
await flush();
assert.equal(rows()[0].querySelector('.separator').textContent, '›');
assert.equal(rows()[0].querySelector('svg').getAttribute('data-src'), '/home.SVG');
assert.equal(rows()[1].querySelector('button').textContent.trim(), 'All orders');
state.items.reverse();
await flush();
assert.equal(current().textContent.trim(), 'Custom home', 'Keyed reorder must update the current item');
rows()[0].querySelector('button').click();
assert.deepEqual(parentEvents.at(-1).detail, { name: 'detail', index: 0 }, 'Selection indices follow displayed order');
state.items.pop();
await flush();
assert.equal(current().textContent.trim(), 'All orders', 'Removing the last item promotes its predecessor');
assert.equal(root.access.items.size, 2, 'Unmounting must release the removed child');
state.items.push({ name: 'new', label: 'New page', disabled: true });
await flush();
assert.equal(current().textContent.trim(), 'New page', 'A newly appended last item becomes current, even when disabled');
assert.equal(rows().at(-1).querySelector('.separator'), null);
state.items = [{ name: 'single', label: 'Only page' }];
await flush();
assert.equal(host.querySelectorAll('button, .separator').length, 0, 'A single current item has no action or separator');
state.items = [];
await flush();
assert.equal(rows().length, 0);
assert.equal(root.access.items.size, 0);
state.items = [{ name: 'a', label: 'A' }, { name: 'b', label: 'B' }];
await flush();
assert.equal(current().textContent.trim(), 'B', 'The control must support repopulating an empty path');
app.unmount();
assert.equal(root.access.items, null);
assert.equal(itemControls().every(item => item.breadcrumb === null), true, 'Unmounting clears all parent references');
host.remove();
dom.window.close();
console.log('Breadcrumb selection, accessibility, disabled guards, slots, icons, dynamic labels, separator, reorder, removal and cleanup passed.');

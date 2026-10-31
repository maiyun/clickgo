import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test/workspace' });
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'CustomEvent']) {
    globalThis[name] = dom.window[name];
}
const vue = await import('vue');
const instances = [];
const focusState = { active: true };
const parentKey = Symbol('accordion');
const runtimeSource = await readFile(new URL('../../sources/control/accordion/abox/runtime.ts', import.meta.url), 'utf8');
const runtimeCompiled = ts.transpileModule(runtimeSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const runtimeModule = { exports: {} };
new Function('require', 'module', 'exports', runtimeCompiled)(() => ({}), runtimeModule, runtimeModule.exports);
const wrapperSource = await readFile(new URL('../../sources/control/accordion/lib/runtime.ts', import.meta.url), 'utf8');
const wrapperCompiled = ts.transpileModule(wrapperSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const wrapperModule = { exports: {} };
new Function('require', 'module', 'exports', wrapperCompiled)(() => runtimeModule.exports, wrapperModule, wrapperModule.exports);

class AbstractControl {
    propBoolean(name) { return this.props[name] === true || this.props[name] === 'true'; }
}

async function component(name) {
    const directory = new URL(`../../sources/control/${name}/`, import.meta.url);
    const source = await readFile(new URL('code.ts', directory), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const module = { exports: {} };
    new Function('require', 'module', 'exports', compiled)(path => path === './lib/runtime' ? wrapperModule.exports : ({ control: { AbstractControl } }), module, module.exports);
    const Control = module.exports.default;
    const defaults = new Control().props;
    const props = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, { default: value }]));
    const template = await readFile(new URL('layout.html', directory), 'utf8');
    return {
        props,
        emits: ['beforechange', 'changed', 'update:modelValue'],
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
                formFocus: { get: () => focusState.active },
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
            exposed.watch = (name, callback, options) => vue.watch(() => properties[name], callback, options);
            exposed.emit = (event, value) => context.emit(event, value);
            exposed.parentByName = target => target === 'accordion' ? parent : null;
            vue.markRaw(exposed);
            if (name === 'accordion') { vue.provide(parentKey, exposed); }
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

const Accordion = await component('accordion');
const AccordionItem = await component('accordion-item');
const flush = async () => { for (let i = 0; i < 5; ++i) await vue.nextTick(); };
const state = vue.reactive({ value: ['missing', 'a', 'a'], multiple: false, disabled: false, cancel: false, items: ['a', 'b', 'c'] });
const events = [];
const host = document.createElement('div');
document.body.append(host);
const app = vue.createApp({
    render: () => vue.h(Accordion, {
        modelValue: state.value, multiple: state.multiple, disabled: state.disabled, level: 8,
        'onUpdate:modelValue': value => { state.value = value; },
        onBeforechange: event => { events.push(['before', [...event.detail.value]]); if (state.cancel) event.preventDefault(); },
        onChanged: event => events.push(['changed', [...event.detail.value]]),
    }, { default: () => state.items.map(name => vue.h(AccordionItem, { key: name, name, label: name, disabled: name === 'c' }, {
        default: () => vue.h('input', { value: name }),
        header: name === 'a' ? () => vue.h('strong', 'Custom A') : undefined,
    })) }),
});
app.mount(host);
await flush();
assert.deepEqual(state.value, ['missing'], 'Initial external value is normalized and synchronized');
assert.equal(events.length, 0, 'Normalization does not emit user change events');
const root = instances.find(entry => entry.name === 'accordion').control;
const buttons = () => [...host.querySelectorAll('.trigger')];
const panels = () => [...host.querySelectorAll('.panel')];
assert.equal(buttons()[0].getAttribute('aria-expanded'), 'false');
assert.equal(host.querySelector('[role="heading"]').getAttribute('aria-level'), '6');
assert.equal(buttons()[0].querySelector('strong').textContent, 'Custom A');
assert.equal(new Set(buttons().map(button => button.id)).size, 3);
for (const button of buttons()) assert.equal(document.getElementById(button.getAttribute('aria-controls')).getAttribute('aria-labelledby'), button.id);
buttons()[0].click();
await flush();
assert.deepEqual(state.value, ['a']);
assert.equal(panels()[0].getAttribute('aria-hidden'), 'false');
assert.equal(panels()[0].hasAttribute('inert'), false);
assert.deepEqual(events.map(event => event[0]), ['before', 'changed']);
state.cancel = true;
buttons()[1].click();
await flush();
assert.deepEqual(state.value, ['a']);
assert.equal(events.length, 3);
state.cancel = false;
const keyEvents = events.length;
buttons()[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', repeat: true, cancelable: true }));
buttons()[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', cancelable: true }));
buttons()[1].dispatchEvent(new window.FocusEvent('blur'));
buttons()[1].dispatchEvent(new window.KeyboardEvent('keyup', { key: ' ', cancelable: true }));
assert.equal(events.length, keyEvents, 'Repeated Enter and Space after blur do not activate');
state.multiple = true;
await flush();
buttons()[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
await flush();
assert.deepEqual(state.value, ['a', 'b']);
const modeEvents = events.length;
state.multiple = false;
await flush();
assert.deepEqual(state.value, ['a'], 'Changing to single synchronizes the model');
assert.equal(events.length, modeEvents, 'Mode normalization does not emit user change events');
state.multiple = true;
state.value = ['a', 'b', 'a'];
await flush();
assert.deepEqual(state.value, ['a', 'b'], 'External duplicates are synchronized away');
assert.equal(events.length, modeEvents);
state.multiple = false;
state.value = ['b', 'a', 'b'];
await flush();
assert.deepEqual(state.value, ['b'], 'Single mode normalizes externally supplied multiple values');
assert.equal(events.length, modeEvents);
state.multiple = true;
state.value = ['a', 'b'];
await flush();
buttons()[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', cancelable: true }));
buttons()[1].dispatchEvent(new window.KeyboardEvent('keyup', { key: ' ', cancelable: true }));
await flush();
assert.deepEqual(state.value, ['a']);
const beforeDisabled = events.length;
buttons()[2].click();
state.disabled = true;
await flush();
buttons()[0].click();
assert.equal(events.length, beforeDisabled);
state.disabled = false;
await flush();
buttons()[0].focus();
buttons()[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }));
assert.equal(document.activeElement, buttons()[1]);
buttons()[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', cancelable: true }));
assert.equal(document.activeElement, buttons()[0]);
buttons()[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', cancelable: true }));
assert.equal(document.activeElement, buttons()[1]);
focusState.active = false;
buttons()[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', cancelable: true }));
assert.equal(document.activeElement, buttons()[1], 'An unfocused form does not move focus');
focusState.active = true;
panels()[0].querySelector('input').focus();
state.value = [];
state.disabled = true;
await flush();
assert.equal(buttons()[0].getAttribute('aria-disabled'), 'true');
assert.equal(document.activeElement, buttons()[0]);
assert.equal(panels()[0].getAttribute('aria-hidden'), 'true');
assert.equal(panels()[0].hasAttribute('inert'), true);
assert.ok(panels()[0].querySelector('input'), 'Closing preserves mounted content during and after the animation');
state.disabled = false;
await flush();
const firstId = buttons()[0].id;
state.items.reverse();
await flush();
assert.equal(buttons()[2].id, firstId);
state.items = ['b'];
await flush();
assert.equal(root.access.items.size, 1);
state.items.push('a');
await flush();
assert.notEqual(buttons()[1].id, firstId);
app.unmount();
assert.equal(root.access.items, null);

const standalone = vue.createApp({
    render: () => vue.h(Accordion, { onBeforechange: event => { event.detail.value.push('injected'); } }, {
        default: () => vue.h(AccordionItem, { name: 'solo', label: 'Solo' }),
    }),
});
standalone.mount(host);
await flush();
buttons()[0].click();
await flush();
assert.equal(buttons()[0].getAttribute('aria-expanded'), 'true', 'Unbound controls maintain their own state');
const standaloneRoot = instances.filter(entry => entry.name === 'accordion').at(-1).control;
assert.deepEqual([...standaloneRoot.value], ['solo'], 'Changing event detail must not change the committed value');
standalone.unmount();

let destroyedUpdates = 0;
let destroyedChanges = 0;
const destroyed = vue.createApp({
    render: () => vue.h(Accordion, {
        onBeforechange: () => destroyed.unmount(),
        'onUpdate:modelValue': () => { ++destroyedUpdates; },
        onChanged: () => { ++destroyedChanges; },
    }, { default: () => vue.h(AccordionItem, { name: 'x', label: 'X' }) }),
});
destroyed.mount(host);
await flush();
buttons()[0].click();
assert.equal(destroyedUpdates, 0, 'Unmount during beforechange prevents submission');
assert.equal(destroyedChanges, 0);

const nestedState = vue.reactive({ outer: [], inner: [] });
const nested = vue.createApp({
    render: () => vue.h(Accordion, {
        modelValue: nestedState.outer,
        'onUpdate:modelValue': value => { nestedState.outer = value; },
    }, { default: () => vue.h(AccordionItem, { name: 'outer', label: 'Outer' }, {
        default: () => vue.h(Accordion, {
            modelValue: nestedState.inner,
            'onUpdate:modelValue': value => { nestedState.inner = value; },
        }, { default: () => vue.h(AccordionItem, { name: 'inner', label: 'Inner' }) }),
    }) }),
});
nested.mount(host);
await flush();
const nestedButtons = buttons();
nestedButtons[0].click();
await flush();
nestedButtons[1].click();
await flush();
assert.deepEqual(nestedState.outer, ['outer']);
assert.deepEqual(nestedState.inner, ['inner']);
assert.notEqual(nestedButtons[0].id, nestedButtons[1].id);
nested.unmount();
host.remove();
dom.window.close();
console.log('Accordion selection, cancellation, keyboard, disabled state, accessibility, focus, reorder and cleanup passed.');

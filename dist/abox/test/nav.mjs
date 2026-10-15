import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) {
    globalThis[name] = dom.window[name];
}
const vue = await import('vue');

class AbstractControl {
    slots = {};
    refs = {};
    rootForm = { formHash: '' };
    emitted = [];
    slotsAll(name) { return this.slots[name]?.() ?? []; }
    propBoolean(name) { return this.props[name] === true || this.props[name] === 'true'; }
    propNumber(name) { return Number(this.props[name]) || 0; }
    emit(name, value) { this.emitted.push([name, value]); }
    nextTick() { return vue.nextTick(); }
}

async function load(name) {
    const source = await readFile(new URL(`../../sources/control/${name}/code.ts`, import.meta.url), 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const module = { exports: {} };
    new Function('require', 'module', 'exports', code)(
        () => ({ control: { AbstractControl }, tool: { clone: value => structuredClone(value) } }),
        module, module.exports
    );
    return module.exports.default;
}

const Nav = await load('nav');
const NavItem = await load('nav-item');

async function render(name, Control, slots = {}, props = {}, nav = null) {
    const template = await readFile(new URL(`../../sources/control/${name}/layout.html`, import.meta.url), 'utf8');
    const control = new Control();
    Object.assign(control.props, props);
    if (nav) { control.nav = nav; }
    const Component = {
        setup(_, context) {
            control.slots = context.slots;
            const state = vue.reactive(control);
            const exposed = {};
            for (const key of Object.keys(control)) {
                Object.defineProperty(exposed, key, {
                    enumerable: true, get: () => state[key], set: value => { state[key] = value; },
                });
            }
            for (const key of Object.keys(control.props)) {
                Object.defineProperty(exposed, key, { enumerable: true, get: () => state.props[key] });
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
            return exposed;
        },
        render: vue.compile(template),
    };
    const host = document.createElement('div');
    document.body.append(host);
    const app = vue.createApp({ render: () => vue.h(Component, null, slots) });
    app.component('cg-flow', { render() { return vue.h('div', { 'data-menu-scroll': '' }, this.$slots.default?.()); } });
    app.component('cg-svg', { render: () => vue.h('svg') });
    app.component('cg-img', { render: () => vue.h('img') });
    app.mount(host);
    await vue.nextTick();
    return { host, control, close() { app.unmount(); host.remove(); } };
}

const legacy = await render('nav', Nav, { default: () => vue.h('div', 'Menu') });
assert.equal(legacy.host.querySelector('.chrome'), null, 'Legacy navigation must not enter fixed-region mode');
assert.equal(legacy.host.querySelector('.menu-panel'), null, 'Legacy navigation keeps the direct menu flow');
assert.equal(legacy.host.querySelector('.menuwrap > .menu')?.textContent, 'Menu');
legacy.close();

for (const regions of [['menu-header'], ['menu-footer'], ['menu-header', 'menu-footer']]) {
    const slots = { default: () => vue.h('div', 'Scrollable menu') };
    for (const region of regions) { slots[region] = () => vue.h('div', region); }
    const framed = await render('nav', Nav, slots);
    const panel = framed.host.querySelector('.menu-panel');
    const menu = panel.querySelector('[data-menu-scroll]');
    assert.equal(menu.textContent, 'Scrollable menu');
    for (const region of regions) {
        const element = panel.querySelector(`.${region}`);
        assert.equal(element.parentElement, panel, `${region} must be outside the menu scroll area`);
        assert.equal(menu.contains(element), false);
    }
    framed.close();
}

const selected = [];
const suffixOnly = await render('nav-item', NavItem, {
    suffix: () => vue.h('span', '24'),
}, { name: 'Orders', label: 'Orders' }, {
    selected: 'Overview', childs: [], select: name => selected.push(name),
});
assert.equal(suffixOnly.control.hasChild, false, 'A suffix must not create a submenu');
assert.equal(suffixOnly.host.querySelector('.menu'), null);
assert.equal(suffixOnly.host.querySelector('.text .suffix')?.textContent, '24');
suffixOnly.host.querySelector('.text').click();
assert.deepEqual(selected, ['Orders'], 'The suffix-only item remains selectable');
suffixOnly.close();

const nested = await render('nav-item', NavItem, {
    default: () => vue.h('div', 'Nested item'), suffix: () => vue.h('span', '2'),
}, { name: 'Products', label: 'Products' }, { selected: '', childs: [] });
assert.notEqual(nested.host.querySelector('.text.hasChild'), null);
nested.host.querySelector('.text').click();
assert.equal(nested.control.showData, true, 'Adding a suffix must preserve submenu expansion');
assert.equal(nested.control.emitted.some(([name]) => name === 'select'), false);
nested.close();

const nav = new Nav();
nav.props.hash = true;
nav.refs.flow = { element: document.createElement('div') };
await nav.select('Orders?page=2');
assert.equal(nav.rootForm.formHash, 'Orders?page=2');
assert.deepEqual(nav.qs, { page: '2' });
const emitted = nav.emitted.length;
await nav.select('Orders?page=2');
assert.equal(nav.emitted.length, emitted, 'Repeated selection remains a no-op');
dom.window.close();
console.log('Nav legacy layout, fixed regions, suffix selection, nested menus, hash and query regressions passed.');

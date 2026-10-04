// Run: node test/select.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
import JSZip from 'jszip';
import { clone, compar, getClassPrototype } from '../dist/lib/tool.js';

const dom = new JSDOM('<!doctype html><html><body><system></system></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
const { createApp, h, reactive, nextTick } = await import('vue');
const errors = [];
const instances = [];
const disposers = new Set();
const sourceDirectory = process.env.CLICKGO_SELECT_TEST_SOURCE_DIR;
const useArchive = process.env.CLICKGO_SELECT_TEST_ARCHIVE === '1';
const archives = new Map();
process.on('unhandledRejection', error => { errors.push(error); });

class AbstractControl {
    get element() { return this.$el; }
    get refs() { return this.$refs; }
    get formFocus() { return true; }
    watch(source, callback, options) {
        return this.$watch(typeof source === 'string' ? () => this.props[source] : source, callback, options);
    }
    emit(...args) { this.$emit(...args); }
    nextTick() { return this.$nextTick(); }
    propBoolean(name) { return [true, 'true', ''].includes(this.props[name]); }
    propInt(name) { return parseInt(this.props[name]); }
    propNumber(name) { return Number(this.props[name]); }
    propArray(name) { return Array.isArray(this.props[name]) ? this.props[name] : [this.props[name]]; }
    parentByName() { return null; }
    fl(value) { return value; }
    l(key) { return this.localeData?.en[key] ?? key; }
}
const clickgo = {
    control: { AbstractControl },
    tool: { clone, compar, sleep: ms => new Promise(resolve => setTimeout(resolve, ms)) },
    task: { sleep() {} },
    modules: { pointer: { click: (event, callback) => callback(), isTouch: () => false } },
    dom: { findParentByData: () => null },
    form: {
        showPop: element => { element.dataset.cgPopOpen = ''; },
        hidePop: element => { delete element.dataset.cgPopOpen; },
    },
};
clickgo.modules.clickgo = clickgo;

/** --- Read HEAD for regression evidence, or the generated package for distribution validation. --- */
async function readControlFile(name, filename) {
    if (sourceDirectory && name === 'select') {
        return await readFile(`${sourceDirectory}/${filename}`, 'utf8');
    }
    if (!useArchive) return await readFile(new URL(`../dist/sources/control/${name}/${filename}`, import.meta.url), 'utf8');
    const archiveName = ['page', 'property'].includes(name) ? name : 'common';
    if (!archives.has(archiveName)) {
        archives.set(archiveName, await JSZip.loadAsync(await readFile(new URL(`../dist/control/${archiveName}.cgc`, import.meta.url))));
    }
    const file = archives.get(archiveName).file(`${name}/${filename === 'code.ts' ? 'code.js' : filename}`);
    assert.ok(file, `packaged ${name}/${filename} must exist`);
    return await file.async('string');
}

/** --- Use the real control classes and Select/List templates; only layout and pointer scheduling are simulated. --- */
async function loadControl(name) {
    const exports = {};
    const source = await readControlFile(name, 'code.ts');
    if (useArchive) {
        exports.default = vm.runInNewContext(`${source}\nemodule;`, { clickgo, Date, Map, Set });
    }
    else {
        vm.runInNewContext(ts.transpileModule(source, {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        }).outputText, { exports, require: () => clickgo, Date, Map, Set });
    }
    const instance = new exports.default();
    const prototype = getClassPrototype(instance);
    return {
        name: `cg-${name}`,
        template: name === 'greatlist' ?
            '<div class="test-greatlist"><div v-for="row, index of data" :data-value="row.value" @pointerdown="innerDown($event, index)"><slot :row="row" :index="index"></slot></div></div>' :
            await readControlFile(name, 'layout.html'),
        props: Object.fromEntries(Object.entries(instance.props).map(([key, value]) => [key, { default: () => clone(value) }])),
        emits: instance.emits,
        data: () => clone(Object.fromEntries(Object.entries(instance).filter(([key]) => !['props', 'emits'].includes(key)))),
        computed: prototype.access,
        methods: prototype.method,
        created() { this.props = this.$props; this.slots = this.$slots; },
        beforeMount() { this.onBeforeMount?.(); },
        async mounted() { await this.$nextTick(); this.onMounted?.(); instances.push([name, this]); },
        beforeUnmount() { this.onBeforeUnmount?.(); },
        unmounted() { this.onUnmounted?.(); },
    };
}
const components = {};
for (const name of ['select', 'list', 'greatlist', 'greatselect', 'calendar', 'datepanel', 'page', 'property']) {
    components[`cg-${name}`] = await loadControl(name);
}
components['cg-text'] = {
    props: ['modelValue'],
    emits: ['update:modelValue', 'keydown', 'blur'],
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @keydown="$emit(\'keydown\', $event)" @blur="$emit(\'blur\')">',
};
components['cg-marquee'] = { template: '<div><slot></slot></div>' };
components['cg-button'] = { template: '<button><slot></slot></button>' };
components['cg-flow'] = { template: '<div><slot></slot></div>' };
for (const name of ['loading', 'icon', 'img', 'check']) {
    components[`cg-${name}`] = { template: '<i></i>' };
}
for (const name of ['menulist', 'menulist-item', 'menulist-split']) {
    components[`cg-${name}`] = { template: '<div><slot></slot></div>' };
}

/** --- Drain the real Vue render/watch order, including the Select data watcher and remote debounce. --- */
async function flush() {
    for (let j = 0; j < 3; ++j) {
        for (let i = 0; i < 10; ++i) await nextTick();
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    assert.deepEqual(errors, [], 'controls must update without runtime errors');
}

async function mount(props = {}, handlers = {}, name = 'select') {
    const state = reactive({ ...(name === 'select' ? { data: [], modelValue: [], remoteDelay: 0 } : {}), ...props });
    const events = [];
    const requests = [];
    const host = document.createElement('div');
    document.body.append(host);
    const app = createApp({
        render() {
            return h(components[`cg-${name}`], {
                ...state, ref: 'select',
                'onUpdate:modelValue': value => { events.push(['value', clone(value)]); state.modelValue = value; },
                onLabel: labels => { events.push(['label', clone(labels)]); },
                onRemote: event => { requests.push(event.detail); },
                onChange: event => { events.push(['change', clone(event.detail)]); handlers.change?.(event); },
                onChanged: event => { events.push(['changed', clone(event.detail)]); },
                onAdd: event => { events.push(['add', clone(event.detail)]); handlers.add?.(event); },
                onAdded: event => { events.push(['added', clone(event.detail)]); },
                onRemove: event => { events.push(['remove', clone(event.detail)]); handlers.remove?.(event); },
                'onUpdate:count': count => { state.count = count; },
                'onUpdate:yearmonth': yearmonth => { state.yearmonth = yearmonth; },
                onCountchanged: count => { events.push(['countchanged', count]); },
            });
        },
    });
    for (const [name, component] of Object.entries(components)) app.component(name, component);
    app.config.errorHandler = error => { errors.push(error); };
    const root = app.mount(host);
    const dispose = () => { app.unmount(); host.remove(); disposers.delete(dispose); };
    disposers.add(dispose);
    await flush();
    const select = root.$refs.select;
    return {
        state, events, requests, select,
        selectors() { return instances.filter(([controlName, instance]) => controlName === 'select' && host.contains(instance.element)).map(([, instance]) => instance); },
        async click(index) {
            const gl = select.refs.list.refs.gl;
            gl.innerDown({ target: gl.element.children[index], shiftKey: false, ctrlKey: false }, index);
            await flush();
        },
        async key(key) {
            if (select.element.dataset.cgPopOpen === undefined) select.refs.gs.showPop();
            await select.textKeyDown({ key, preventDefault() {}, stopPropagation() {} });
            await flush();
        },
        dispose,
    };
}

const cases = [];
function test(name, callback) { cases.push([name, callback]); }
const option = (value, label = value, extra = {}) => ({ value, label, ...extra });
const remote = { remote: true, search: true };

test('remote initial value survives a nonempty unrelated list and later batches resolve its label', async () => {
    const m = await mount({ ...remote, modelValue: ['42'], data: [option('other')] });
    assert.deepEqual([...m.state.modelValue], ['42']);
    assert.deepEqual([...m.select.label], ['42']);
    m.state.data = [option('another')];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['42']);
    m.state.data = [option('42', 'Loaded')];
    await flush();
    assert.deepEqual([...m.select.label], ['Loaded']);
    m.dispose();
});

test('remote callbacks resolve pending labels; later search pages preserve all selected tags', async () => {
    const m = await mount({ ...remote, multi: true, modelValue: ['42', '43'] });
    await m.select.updateSearchValue('first');
    await m.requests.at(-1).callback([option('42', 'First')]);
    await flush();
    assert.deepEqual([...m.select.label], ['First', '43']);
    await m.select.updateSearchValue('second');
    await m.requests.at(-1).callback([option('43', 'Second')]);
    await flush();
    assert.deepEqual([...m.select.label], ['First', 'Second']);
    assert.deepEqual([...m.state.modelValue], ['42', '43']);
    await m.select.updateSearchValue('');
    await flush();
    assert.deepEqual([...m.select.label], ['First', 'Second']);
    m.dispose();
});

test('editable multi labels update after late data without losing arbitrary input values', async () => {
    const m = await mount({ editable: true, multi: true, modelValue: ['42', 'custom'] });
    m.state.data = [option('42', 'Loaded')];
    await flush();
    assert.deepEqual([...m.select.label], ['Loaded', 'custom']);
    m.dispose();
});

test('local empty data defers validation, then resolves a preloaded model without choosing the first item', async () => {
    const m = await mount({ modelValue: ['42'] });
    assert.deepEqual([...m.state.modelValue], ['42']);
    assert.equal(m.events.filter(event => event[0] === 'value').length, 0);
    m.state.data = [option('other'), option('42', 'Loaded')];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['42']);
    assert.deepEqual([...m.select.label], ['Loaded']);
    m.dispose();
});

test('local required selection still skips disabled and split rows and falls back after removal', async () => {
    const m = await mount({ modelValue: ['invalid'], data: [option('disabled', '', { disabled: true }), option('split', '', { control: 'split' }), option('a', 'A'), option('b', 'B')] });
    assert.deepEqual([...m.state.modelValue], ['a']);
    m.state.data = [option('b', 'B')];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['b']);
    assert.deepEqual([...m.select.label], ['B']);
    m.dispose();
});

test('ordinary data refresh updates labels without repeating modelValue writes', async () => {
    const m = await mount({ data: [option('a', 'A')], modelValue: ['a'] });
    m.events.length = 0;
    m.state.data = [option('a', 'Renamed')];
    await flush();
    assert.deepEqual([...m.select.label], ['Renamed']);
    assert.equal(m.events.filter(event => event[0] === 'value').length, 0);
    m.dispose();
});

test('external model changes during local filtering use the complete source list', async () => {
    const m = await mount({ search: true, data: [option('a', 'Apple'), option('b', 'Banana')], modelValue: ['a'] });
    await m.select.updateSearchValue('Apple');
    await flush();
    m.state.modelValue = ['b'];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['b']);
    assert.deepEqual([...m.select.label], ['Banana']);
    m.state.data = [option('a', 'Apple'), option('b', 'Renamed')];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['b']);
    assert.deepEqual([...m.select.label], ['Renamed']);
    m.dispose();
});

test('dictionary labels and numeric labels can be searched; numeric values can be matched on blur', async () => {
    const m = await mount({ search: true, data: { a: 'Apple', b: 'Banana' } });
    await m.select.updateSearchValue('Apple');
    await flush();
    assert.deepEqual([...m.select.refs.list.dataGl.map(row => row.value)], ['a']);
    m.state.data = [option(42, 123)];
    await m.select.updateSearchValue('123');
    await flush();
    assert.equal(m.select.refs.list.dataGl.length, 1);
    m.state.editable = true;
    await flush();
    await m.select.updateInputValue('123');
    m.select.blur();
    await flush();
    assert.deepEqual([...m.state.modelValue], ['42']);
    m.dispose();
});

test('keyboard navigation in search mode does not commit a value or replace the query', async () => {
    const m = await mount({ search: true, data: [option('a', 'Apple'), option('b', 'Apricot')], modelValue: ['a'] });
    await m.select.updateSearchValue('Ap');
    await flush();
    await m.key('ArrowDown');
    assert.equal(m.select.searchValue, 'Ap');
    assert.deepEqual([...m.state.modelValue], ['a']);
    m.dispose();
});

test('multi search Enter adds the highlighted value instead of the query text', async () => {
    const m = await mount({ ...remote, multi: true });
    await m.select.updateSearchValue('label query');
    await m.requests.at(-1).callback([option('42', 'Found label')]);
    await flush();
    await m.key('ArrowDown');
    await m.key('Enter');
    assert.deepEqual([...m.state.modelValue], ['42']);
    assert.equal(m.events.find(event => event[0] === 'added')[1].value, '42');
    m.dispose();
});

for (const action of ['click', 'key']) {
    test(`search single ${action} honors change.preventDefault`, async () => {
        const m = await mount({ search: true, data: [option('a'), option('b')], modelValue: ['a'] }, { change: event => event.preventDefault() });
        m.select.listValue = ['b'];
        await flush();
        await m[action](action === 'click' ? 1 : 'Enter');
        assert.deepEqual([...m.state.modelValue], ['a']);
        assert.equal(m.events.filter(event => event[0] === 'changed').length, 0);
        m.dispose();
    });
}

test('editable Enter honors change.preventDefault and reports an accepted change with its previous value', async () => {
    let reject = true;
    const m = await mount({ editable: true, modelValue: ['a'] }, { change: event => { if (reject) event.preventDefault(); } });
    m.select.inputValue = 'b';
    m.select.listValue = [];
    await m.key('Enter');
    assert.deepEqual([...m.state.modelValue], ['a']);
    reject = false;
    await m.key('Enter');
    assert.deepEqual([...m.state.modelValue], ['b']);
    assert.deepEqual(m.events.find(event => event[0] === 'changed')[1], { before: ['a'], value: ['b'] });
    m.dispose();
});

test('clicks on disabled or unavailable search results do not select the previous highlighted item', async () => {
    const m = await mount({ search: true, data: [option('a'), option('b', 'B', { disabled: true }), option('c')], unavailableList: ['c'], modelValue: ['a'] });
    m.events.length = 0;
    await m.click(1);
    await m.click(2);
    assert.deepEqual([...m.state.modelValue], ['a']);
    assert.equal(m.events.filter(event => event[0] === 'changed').length, 0);
    m.dispose();
});

test('old remote requests cannot block the current spinner or overwrite newer results; callbacks are one-shot', async () => {
    const m = await mount(remote);
    await m.select.updateSearchValue('old');
    const old = m.requests.at(-1);
    await m.select.updateSearchValue('new');
    const current = m.requests.at(-1);
    await current.callback([option('new')]);
    await flush();
    assert.equal(m.select.searching, 0);
    await old.callback([option('old')]);
    await current.callback([option('duplicate')]);
    await flush();
    assert.deepEqual(m.select.searchData.map(row => row.value), ['new']);
    assert.equal(m.select.searching, 0);
    m.dispose();
});

test('clearing a remote query cancels its spinner and a late callback cannot modify destroyed controls', async () => {
    const m = await mount(remote);
    await m.select.updateSearchValue('pending');
    const request = m.requests.at(-1);
    await m.select.updateSearchValue('');
    await flush();
    assert.equal(m.select.searching, 0);
    m.dispose();
    await request.callback([option('late')]);
    assert.equal(m.select.searchData.length, 0);
});

test('editable multi added events retain the added value after clearing input', async () => {
    const m = await mount({ editable: true, multi: true });
    m.select.inputValue = 'custom';
    await m.select.keydown({ key: 'Enter', preventDefault() {}, stopPropagation() {} });
    await flush();
    assert.deepEqual([...m.state.modelValue], ['custom']);
    assert.equal(m.events.find(event => event[0] === 'added')[1].value, 'custom');
    assert.equal(m.select.inputValue, '');
    m.dispose();
});

test('numeric controlled values used by calendar/date/page/property controls normalize once and remain stable', async () => {
    for (const [value, data] of [[2026, [2025, 2026, 2027]], ['10', ['01', '10', '12']], [20, [10, 20, 50]]]) {
        const m = await mount({ modelValue: [value], data });
        assert.deepEqual([...m.state.modelValue], [String(value)]);
        const count = m.events.filter(event => event[0] === 'value').length;
        m.state.modelValue = [String(value)];
        await flush();
        assert.equal(m.events.filter(event => event[0] === 'value').length, count);
        m.dispose();
    }
});

test('updating data and modelValue in the same render keeps the supplied value', async () => {
    const m = await mount({ data: ['a', 'b'], modelValue: ['a'] });
    m.state.data = ['c', 'd'];
    m.state.modelValue = ['d'];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['d']);
    assert.deepEqual([...m.select.label], ['d']);
    m.dispose();
});

for (const search of [false, true]) {
    test(`accepted single mouse selection reports one change and changed event (search=${search})`, async () => {
        const m = await mount({ search, data: [option('a'), option('b')], modelValue: ['a'] });
        m.events.length = 0;
        await m.click(1);
        assert.deepEqual([...m.state.modelValue], ['b']);
        assert.equal(m.events.filter(event => event[0] === 'change').length, 1);
        assert.deepEqual(m.events.find(event => event[0] === 'changed')[1], { before: ['a'], value: ['b'] });
        m.dispose();
    });
}

test('ordinary multi list toggles and vetoes preserve the actual selected values', async () => {
    let reject = false;
    const m = await mount({ multi: true, data: [option('a'), option('b')], modelValue: ['a'] }, {
        add: event => { if (reject) event.preventDefault(); },
        remove: event => { if (reject) event.preventDefault(); },
    });
    await m.click(1);
    assert.deepEqual([...m.state.modelValue], ['a', 'b']);
    reject = true;
    await m.click(1);
    assert.deepEqual([...m.state.modelValue], ['a', 'b']);
    reject = false;
    await m.click(0);
    assert.deepEqual([...m.state.modelValue], ['b']);
    reject = true;
    await m.click(0);
    assert.deepEqual([...m.state.modelValue], ['b']);
    m.dispose();
});

test('remote tag removal and backspace keep labels aligned; external reorder preserves cached labels', async () => {
    let reject = false;
    const m = await mount({ ...remote, editable: true, multi: true, modelValue: ['a', 'b'], data: [option('a', 'A'), option('b', 'B')] }, { remove: event => { if (reject) event.preventDefault(); } });
    m.state.data = [];
    m.state.modelValue = ['b', 'a'];
    await flush();
    assert.deepEqual([...m.select.label], ['B', 'A']);
    reject = true;
    m.select.removeTag(0);
    await flush();
    assert.deepEqual([...m.state.modelValue], ['b', 'a']);
    reject = false;
    await m.select.keydown({ key: 'Backspace', target: { value: '' } });
    await flush();
    assert.deepEqual([...m.state.modelValue], ['b']);
    assert.deepEqual([...m.select.label], ['B']);
    m.select.removeTag(0);
    await flush();
    assert.deepEqual([...m.state.modelValue], []);
    m.dispose();
});

test('disabled controls ignore keyboard, input and tag removal', async () => {
    const m = await mount({ ...remote, editable: true, multi: true, disabled: true, modelValue: ['a'] });
    m.select.removeTag(0);
    await m.select.keydown({ key: 'Backspace', target: { value: '' } });
    await m.select.updateInputValue('changed');
    await m.select.updateSearchValue('query');
    await flush();
    assert.deepEqual([...m.state.modelValue], ['a']);
    assert.equal(m.requests.length, 0);
    m.dispose();
});

test('map changes refresh selected labels and disabledList changes retain local validation', async () => {
    const m = await mount({ data: [{ id: 'a', display: 'A', name: 'Renamed' }, { id: 'b', display: 'B', name: 'Other' }], map: { value: 'id', label: 'display' }, modelValue: ['a'] });
    m.state.map = { value: 'id', label: 'name' };
    await flush();
    assert.deepEqual([...m.select.label], ['Renamed']);
    m.state.disabledList = ['a'];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['b']);
    m.dispose();
});

test('tree selection opens the selected child and retains child labels during filtering', async () => {
    const m = await mount({ tree: true, search: true, modelValue: ['child'], data: [option('parent', 'Parent', { children: [option('child', 'Child')] }), option('other', 'Other')] });
    assert.deepEqual([...m.select.label], ['Child']);
    await m.select.updateSearchValue('Other');
    await flush();
    m.state.modelValue = ['child'];
    m.state.data = [option('parent', 'Parent', { children: [option('child', 'Renamed')] }), option('other', 'Other')];
    await flush();
    assert.deepEqual([...m.state.modelValue], ['child']);
    assert.deepEqual([...m.select.label], ['Renamed']);
    m.dispose();
});

test('mode changes preserve remote unknown values, then enforce local validation', async () => {
    const m = await mount({ ...remote, editable: true, multi: true, modelValue: ['unknown', 'a'], data: [option('a', 'A')] });
    m.state.editable = false;
    await flush();
    assert.deepEqual([...m.state.modelValue], ['unknown', 'a']);
    m.state.multi = false;
    await flush();
    assert.deepEqual([...m.state.modelValue], ['unknown']);
    m.state.remote = false;
    await flush();
    assert.deepEqual([...m.state.modelValue], []);
    m.state.search = false;
    await flush();
    assert.deepEqual([...m.state.modelValue], ['a']);
    m.dispose();
});

test('search and metadata toggles do not discard a multi editor input in progress', async () => {
    const m = await mount({ editable: true, multi: true, data: [option('a')], modelValue: ['a'] });
    await m.select.updateInputValue('draft');
    m.state.search = true;
    await flush();
    assert.equal(m.select.inputValue, 'draft');
    m.state.disabledList = ['a'];
    await flush();
    assert.equal(m.select.inputValue, 'draft');
    assert.deepEqual([...m.state.modelValue], ['a']);
    m.dispose();
});

test('external editable values invalidate pending searches for the previous input', async () => {
    const m = await mount({ ...remote, editable: true });
    await m.select.updateInputValue('old');
    const request = m.requests.at(-1);
    m.state.modelValue = ['new'];
    await flush();
    await request.callback([option('old', 'Old label')]);
    await flush();
    assert.deepEqual([...m.state.modelValue], ['new']);
    assert.deepEqual([...m.select.label], ['new']);
    assert.equal(m.select.searchData.length, 0);
    m.dispose();
});

test('remote requests that are superseded during nextTick cannot run their old success handler', async () => {
    const m = await mount(remote);
    await m.select.updateSearchValue('old');
    const old = m.requests.at(-1);
    const callback = old.callback([option('old')]);
    const search = m.select.updateSearchValue('new');
    await Promise.all([callback, search]);
    await m.requests.at(-1).callback([option('new')]);
    await flush();
    assert.deepEqual([...m.select.listValue], ['new']);
    assert.deepEqual([...m.select.searchData.map(row => row.value)], ['new']);
    m.dispose();
});

test('debounce dispatches only the newest query and unmount cancels a queued dispatch', async () => {
    const m = await mount({ ...remote, remoteDelay: 10 });
    await Promise.all([m.select.updateSearchValue('old'), m.select.updateSearchValue('new')]);
    assert.deepEqual(m.requests.map(request => request.value), ['new']);
    const queued = m.select.updateSearchValue('queued');
    m.dispose();
    await queued;
    assert.equal(m.requests.length, 1);
});

test('editable remote debounce commits only the latest typed value and emits changed once', async () => {
    const m = await mount({ ...remote, editable: true, remoteDelay: 10 });
    m.events.length = 0;
    await Promise.all([m.select.updateInputValue('old'), m.select.updateInputValue('new')]);
    await flush();
    assert.deepEqual([...m.state.modelValue], ['new']);
    assert.deepEqual(m.events.filter(event => event[0] === 'changed').map(event => event[1]), [{ before: [], value: ['new'] }]);
    assert.deepEqual(m.requests.map(request => request.value), ['new']);
    m.dispose();
});

test('blur canonicalization honors the change veto instead of silently replacing an entered label', async () => {
    const m = await mount({ editable: true, data: [option('42', 'Forty')] }, { change: event => { if (event.detail.value[0] === '42') event.preventDefault(); } });
    await m.select.updateInputValue('Forty');
    m.select.blur();
    await flush();
    assert.deepEqual([...m.state.modelValue], ['Forty']);
    m.dispose();
});

test('plain List keeps its own missing-value filtering contract', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const state = reactive({ modelValue: ['missing'] });
    const app = createApp({ render: () => h(components['cg-list'], { data: ['a'], must: false, modelValue: state.modelValue, 'onUpdate:modelValue': value => { state.modelValue = value; } }) });
    for (const [name, component] of Object.entries(components)) app.component(name, component);
    app.config.errorHandler = error => { errors.push(error); };
    app.mount(host);
    await flush();
    assert.deepEqual([...state.modelValue], []);
    app.unmount();
    host.remove();
});

test('Page uses Select to change page size exactly once and recomputes the page count', async () => {
    const m = await mount({ modelValue: 1, count: 20, counts: [10, 20, 50], total: 100 }, {}, 'page');
    assert.deepEqual([...m.select.countSelect], ['20']);
    assert.equal(m.select.maxPage, 5);
    const select = m.selectors()[0];
    select.refs.list.refs.gl.innerDown({ target: select.refs.list.refs.gl.element.children[2], shiftKey: false, ctrlKey: false }, 2);
    await flush();
    assert.equal(m.state.count, 50);
    assert.equal(m.select.maxPage, 2);
    assert.equal(m.events.filter(event => event[0] === 'countchanged').length, 1);
    m.dispose();
});

for (const name of ['calendar', 'datepanel']) {
    test(`${name} retains its selected year/month after its Select lists refresh`, async () => {
        const m = await mount({ yearmonth: '202610' }, {}, name);
        await flush();
        assert.deepEqual([...m.select.vyear], ['2026']);
        assert.deepEqual([...m.select.vmonth], ['10']);
        assert.equal(m.selectors().length >= 2, true);
        m.state.yearmonth = '202701';
        await flush();
        assert.deepEqual([...m.select.vyear], ['2027']);
        assert.deepEqual([...m.select.vmonth], [name === 'calendar' ? '01' : '1']);
        m.dispose();
    });
}

test('Property uses inline modelValue arrays without recursive writes and accepts a choice', async () => {
    const m = await mount({ modelValue: [{ title: 'Choice', control: 'select', value: 'b', data: ['a', 'b', 'c'] }] }, {}, 'property');
    m.select.selectedTitle = 'Choice';
    await flush();
    const select = m.selectors()[0];
    assert.deepEqual([...select.value], ['b']);
    select.refs.list.refs.gl.innerDown({ target: select.refs.list.refs.gl.element.children[2], shiftKey: false, ctrlKey: false }, 2);
    await flush();
    assert.equal(m.state.modelValue[0].value, 'c');
    m.dispose();
});

let failures = 0;
for (const [name, callback] of cases) {
    try {
        await callback();
        console.log(`PASS ${name}`);
    }
    catch (error) {
        ++failures;
        console.error(`FAIL ${name}\n${error.stack}`);
        errors.length = 0;
    }
    finally {
        for (const dispose of disposers) dispose();
        instances.length = 0;
    }
}
console.log(`${cases.length - failures}/${cases.length} Select integration cases passed.`);
if (failures) process.exitCode = 1;

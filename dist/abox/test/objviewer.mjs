import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test/' });
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'Event', 'KeyboardEvent']) {
    globalThis[name] = dom.window[name];
}
const vue = await import('vue');
const observers = new Map();
const instances = [];
const parentKey = Symbol('viewer');
class AbstractControl {
    propBoolean(name) { return this.props[name] !== false && this.props[name] !== 'false' && this.props[name] !== undefined; }
    propNumber(name) { return Number(this.props[name]); }
}
const clickgo = {
    control: { AbstractControl }, form: { doFocusAndPopEvent: async () => {} },
    dom: {
        watchSizeMulti(_owner, element, callback) { observers.set(element, callback); return true; },
        unwatchSizeMulti(_owner, element, callback) { if (observers.get(element) === callback) observers.delete(element); }
    }
};
const cache = new Map();
function load(url) {
    if (cache.has(url.href)) return cache.get(url.href);
    const module = { exports: {} };
    cache.set(url.href, module.exports);
    const code = ts.transpileModule(readFileSync(url, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    new Function('require', 'module', 'exports', code)(specifier => {
        if (specifier === 'clickgo') return clickgo;
        return load(new URL(specifier.replace(/\.js$/, '') + '.ts', url));
    }, module, module.exports);
    cache.set(url.href, module.exports);
    return module.exports;
}
const directory = new URL('../../sources/control/', import.meta.url);
const { arrange } = load(new URL('objviewer/lib/layout.ts', directory));
const node = (id, extra = {}) => ({ id, width: 184, height: 80, x: 0, y: 0, hub: false, ...extra });
const links = [
    { source: 'hub', target: 'a', status: 'online' }, { source: 'hub', target: 'b' },
    { source: 'b', target: 'c' }, { source: 'c', target: 'hub' }, { source: 'missing', target: 'a' }
];
function validScene(scene, separate = true) {
    for (const n of scene.nodes) {
        assert.ok([n.x, n.y, n.width, n.height].every(Number.isFinite));
        assert.ok(n.x >= 47.999 && n.y >= 47.999);
        assert.ok(n.x + n.width <= scene.width - 47.9 && n.y + n.height <= scene.height - 47.9);
    }
    for (const edge of scene.edges) assert.ok(!/NaN|Infinity/.test(edge.path));
    if (!separate) return;
    for (let a = 0; a < scene.nodes.length; ++a) for (let b = a + 1; b < scene.nodes.length; ++b) {
        const x = scene.nodes[a], y = scene.nodes[b];
        assert.ok(x.x + x.width <= y.x + .01 || y.x + y.width <= x.x + .01 ||
            x.y + x.height <= y.y + .01 || y.y + y.height <= x.y + .01, 'automatic layout overlaps nodes');
    }
}
for (const mode of ['radial', 'tree', 'compact']) {
    const input = [node('hub', { width: 144, height: 136, hub: true }), ...['a', 'b', 'c', 'island'].map(id => node(id))];
    const before = JSON.stringify(input);
    const scene = arrange(input, links, mode, 'hub', 72);
    validScene(scene);
    assert.equal(scene.edges.length, 4);
    assert.equal(JSON.stringify(input), before, 'layout must not mutate caller data');
    assert.deepEqual(scene, arrange(input, links, mode, 'hub', 72), 'layout is deterministic');
}
const manual = arrange([node('a', { x: -300, y: -50 }), node('b', { x: 120, y: 150 })], [{ source: 'a', target: 'b' }], 'manual', '', 72);
validScene(manual);
assert.equal(manual.nodes[1].x - manual.nodes[0].x, 420);
assert.equal(manual.nodes[1].y - manual.nodes[0].y, 200);
assert.deepEqual(arrange([], [], 'radial', '', 72), { nodes: [], edges: [], width: 0, height: 0 });
validScene(arrange([node('a', { x: NaN, y: Infinity })], [{ source: 'a', target: 'a' }], 'manual', '', NaN));
const motionNodes = [node('a'), node('b', { x: 400, y: 200 })];
for (const mode of ['radial', 'tree', 'compact', 'manual']) {
    const base = arrange(motionNodes, [{ source: 'a', target: 'b' }], mode, 'a', 48);
    assert.deepEqual([base.edges[0].animation, base.edges[0].direction, base.edges[0].duration, base.edges[0].dotCount],
        ['none', 'forward', 3, 3]);
    for (const direction of ['forward', 'reverse', 'both']) {
        const scene = arrange(motionNodes, [{ source: 'a', target: 'b', animation: 'dots', direction, duration: 2, dotCount: 4 }], mode, 'a', 48);
        assert.deepEqual(scene.nodes, base.nodes, 'animation must not change relationship layout');
        assert.equal(scene.edges[0].path, base.edges[0].path, 'animation must keep the source-to-target geometry');
    }
}
for (const [input, expected] of [
    [{ animation: 'unknown', direction: 'unknown', duration: NaN, dotCount: Infinity }, ['none', 'forward', 3, 3]],
    [{ animation: 'dash', direction: 'reverse', duration: -1, dotCount: 0 }, ['dash', 'reverse', .25, 1]],
    [{ animation: 'dots', direction: 'both', duration: 100, dotCount: 100 }, ['dots', 'both', 60, 8]],
    [{ duration: 1.75, dotCount: 2.6 }, ['none', 'forward', 1.75, 3]]
]) {
    for (const target of ['a', 'b']) {
        const edge = arrange(motionNodes, [{ source: 'a', target, ...input }], 'manual', '', 48).edges[0];
        assert.deepEqual([edge.animation, edge.direction, edge.duration, edge.dotCount], expected);
    }
}
for (const count of [1, 2, 3, 20, 200]) {
    const nodes = Array.from({ length: count }, (_, i) => node(String(i), { width: 160 + i % 4 * 40, height: 60 + i % 3 * 20 }));
    const edges = nodes.slice(1).map(n => ({ source: '0', target: n.id }));
    validScene(arrange(nodes, edges, 'radial', '0', 24));
}

function samplePath(path) {
    const tokens = path.match(/[MLQ]|-?(?:\d*\.?\d+)(?:e[+-]?\d+)?/gi);
    assert.equal(tokens.length, 6, 'a connection must be a single direct segment without detours');
    assert.equal(tokens[0], 'M'); assert.equal(tokens[3], 'L');
    const [x1, y1, x2, y2] = [tokens[1], tokens[2], tokens[4], tokens[5]].map(Number);
    return Array.from({ length: 101 }, (_, step) => {
        const t = step / 100;
        return { x: (1 - t) * x1 + t * x2, y: (1 - t) * y1 + t * y2 };
    });
}
for (const [x, y] of [[-280, 180], [280, 180], [-20, 240], [210, 240], [-250, 240], [0, -220], [320, 0]]) {
    for (const reverse of [false, true]) for (const secondHub of [false, true]) {
        const edge = reverse ? { source: 'other', target: 'hub' } : { source: 'hub', target: 'other' };
        const scene = arrange([
            node('hub', { width: 144, height: 136, hub: true }),
            node('other', { x, y, ...(secondHub ? { width: 144, height: 152, hub: true } : {}) })
        ], [edge], 'manual', '', 48);
        validScene(scene);
        const points = samplePath(scene.edges[0].path);
        for (const hub of scene.nodes.filter(n => n.hub)) {
            assert.ok(points.every(p => p.x < hub.x || p.x > hub.x + hub.width ||
                p.y < hub.y + 84 || p.y > hub.y + hub.height), 'connection must avoid hub captions');
            const endpoint = hub.id === edge.source ? points[0] : points[points.length - 1];
            const onCircle = Math.abs(Math.hypot(endpoint.x - hub.x - hub.width / 2, endpoint.y - hub.y - 36) - 36) < .001;
            const labelDistance = Math.hypot(endpoint.x - Math.max(hub.x, Math.min(hub.x + hub.width, endpoint.x)),
                endpoint.y - Math.max(hub.y + 84, Math.min(hub.y + hub.height, endpoint.y)));
            assert.ok(onCircle || (labelDistance > 0 && labelDistance <= 9),
                'connection must terminate at the emblem or just outside its caption');
        }
    }
}
const cardinal = arrange([node('hub', { width: 144, height: 136, hub: true }),
    ...['north', 'east', 'south', 'west'].map(id => node(id))],
    ['north', 'east', 'south', 'west'].map(target => ({ source: 'hub', target })), 'radial', 'hub', 48);
validScene(cardinal);
const hub = cardinal.nodes[0], cx = hub.x + hub.width / 2, cy = hub.y + 36;
for (const [i, n] of cardinal.nodes.slice(1).entries()) {
    assert.ok(Math.abs(i % 2 ? n.y + n.height / 2 - cy : n.x + n.width / 2 - cx) < .001,
        'cardinal neighbors must align with the hub emblem rather than the caption box center');
    samplePath(cardinal.edges[i].path);
}
const narrowCaption = arrange([node('hub', { width: 144, height: 136, hub: true, captionWidth: 96 }),
    node('other', { x: -300, y: 200 })], [{ source: 'hub', target: 'other' }], 'manual', '', 48);
const narrowStart = samplePath(narrowCaption.edges[0].path)[0], narrowHub = narrowCaption.nodes[0];
assert.ok(Math.abs(Math.hypot(narrowStart.x - narrowHub.x - 72, narrowStart.y - narrowHub.y - 36) - 36) < .001,
    'transparent space outside the measured caption must not shorten the connection');

async function component(name) {
    const Control = load(new URL(name + '/code.ts', directory)).default;
    const defaults = new Control().props;
    const props = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, { default: () => value }]));
    const template = readFileSync(new URL(name + '/layout.html', directory), 'utf8');
    return {
        props, emits: ['update:modelValue', 'select'],
        setup(properties, context) {
            const original = new Control();
            vue.markRaw(original.access);
            const state = vue.reactive(original);
            const instance = vue.getCurrentInstance();
            const parent = vue.inject(parentKey, null);
            const exposed = {};
            for (const key of Object.keys(original)) {
                if (key === 'props' || key === 'emits') continue;
                Object.defineProperty(exposed, key, { enumerable: true, get: () => state[key], set: v => { state[key] = v; } });
            }
            Object.defineProperties(exposed, {
                props: { get: () => properties }, refs: { get: () => instance.refs },
                element: { get: () => instance.proxy.$el }
            });
            for (const key of Object.keys(defaults)) Object.defineProperty(exposed, key, { enumerable: true, get: () => properties[key] });
            for (let proto = Control.prototype; proto !== Object.prototype; proto = Object.getPrototypeOf(proto)) {
                for (const key of Object.getOwnPropertyNames(proto)) {
                    if (key === 'constructor' || Object.hasOwn(exposed, key)) continue;
                    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
                    if (descriptor.get) {
                        const value = vue.computed(() => descriptor.get.call(exposed));
                        Object.defineProperty(exposed, key, { enumerable: true, get: () => value.value });
                    }
                    else if (typeof descriptor.value === 'function') exposed[key] = (...args) => descriptor.value.apply(exposed, args);
                }
            }
            exposed.nextTick = vue.nextTick;
            exposed.watch = (source, callback, options) => vue.watch(typeof source === 'string' ? () => properties[source] : source, callback, options);
            exposed.emit = (event, value) => context.emit(event, value);
            exposed.parentByName = target => target === 'objviewer' ? parent : null;
            exposed.slotsAll = name => context.slots[name]?.() ?? [];
            exposed.l = key => exposed.localeData.en[key];
            vue.markRaw(exposed);
            if (name === 'objviewer') vue.provide(parentKey, exposed);
            exposed.onCreated?.();
            vue.onMounted(() => {
                if (name === 'objviewer-item') {
                    Object.defineProperties(exposed.element, {
                        offsetWidth: { get: () => properties.variant === 'hub' ? 144 : 184 },
                        offsetHeight: { get: () => properties.variant === 'hub' ? 136 : 80 + Math.floor(properties.description.length / 30) * 16 }
                    });
                }
                exposed.onMounted?.();
            });
            vue.onUpdated(() => exposed.onUpdated?.());
            vue.onBeforeUnmount(() => exposed.onBeforeUnmount?.());
            instances.push({ name, control: exposed });
            return exposed;
        },
        render: vue.compile(template, { isCustomElement: tag => tag.startsWith('cg-') && tag !== 'cg-panzoom' })
    };
}
const Viewer = await component('objviewer');
const Item = await component('objviewer-item');
const View = {
    props: ['contentWidth', 'contentHeight'],
    setup(_, { slots, expose }) {
        expose({ zoomFit() {}, zoomTo() {}, zoomData: 1 });
        return () => vue.h('div', slots.default?.());
    }
};
const state = vue.reactive({ ids: ['hub', 'a', 'b'], edges: links, selected: '', disabled: false, mode: 'radial', description: '', invalid: false });
const selections = [];
let actions = 0;
const host = document.createElement('div'); document.body.append(host);
const app = vue.createApp({
    render: () => vue.h(Viewer, {
        edges: state.edges, root: 'hub', layout: state.mode, disabled: state.disabled,
        modelValue: state.selected, 'onUpdate:modelValue': value => { state.selected = value; }, onSelect: e => selections.push(e.detail.nodeId)
    }, { default: () => state.ids.map(id => vue.h(Item, {
        key: id, nodeId: state.invalid ? '' : id, label: id, description: state.description, variant: id === 'hub' ? 'hub' : 'card'
    }, { default: () => id === 'a' ? vue.h('button', { onClick: () => { ++actions; } }, 'Node action') : [] })) })
});
app.component('cg-panzoom', View);
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('cg-') && tag !== 'cg-panzoom';
app.mount(host);
const flush = async () => { for (let i = 0; i < 10; ++i) await vue.nextTick(); };
await flush();
const viewer = instances.find(i => i.name === 'objviewer').control;
const item = id => [...viewer.access.items.values()].find(i => i.props.nodeId === id);
assert.equal(viewer.scene.nodes.length, 3);
assert.equal(viewer.scene.edges.length, 2);
assert.equal(observers.size, 7);
const hubBody = item('hub').refs.body;
Object.defineProperty(hubBody, 'offsetWidth', { configurable: true, value: 100 });
observers.get(hubBody)(); await flush();
assert.equal(viewer.scene.nodes[0].captionWidth, 100);
Object.defineProperty(hubBody, 'offsetWidth', { configurable: true, value: 120 });
observers.get(hubBody)(); await flush();
assert.equal(viewer.scene.nodes[0].captionWidth, 120, 'caption width changes must update endpoints even with a fixed node footprint');
const motionEdge = { source: 'hub', target: 'a', animation: 'dots', direction: 'forward', duration: 3, dotCount: 3 };
state.edges = [motionEdge]; await flush();
const motions = () => [...host.querySelectorAll('animateMotion')];
const drawn = () => host.querySelector('svg.links > g');
assert.equal(host.querySelectorAll('svg.links path').length, 1, 'dots must retain one stationary base line');
assert.equal(drawn().classList.contains('flow'), false);
assert.equal(motions().length, 3);
assert.deepEqual(motions().map(e => e.getAttribute('begin')), ['0s', '-1s', '-2s']);
assert.ok(motions().every(e => e.namespaceURI === 'http://www.w3.org/2000/svg' && e.getAttribute('keyPoints') === '0;1' &&
    e.getAttribute('keyTimes') === '0;1' && e.getAttribute('calcMode') === 'linear' && e.getAttribute('repeatCount') === 'indefinite'));
const previousMotion = motions()[0];
state.edges[0].direction = 'reverse'; await flush();
assert.ok(motions().every(e => e.getAttribute('keyPoints') === '1;0'));
assert.equal(previousMotion.isConnected, false, 'native motion must restart when direction changes');
state.edges[0].direction = 'both'; state.edges[0].dotCount = 2; state.edges[0].duration = 4; await flush();
assert.equal(motions().length, 4);
assert.deepEqual(motions().map(e => [e.getAttribute('keyPoints'), e.getAttribute('begin'), e.getAttribute('dur')]),
    [['0;1', '0s', '4s'], ['0;1', '-2s', '4s'], ['1;0', '-1s', '4s'], ['1;0', '-3s', '4s']]);
for (const [mode, target] of [['manual', 'a'], ['auto', 'a'], ['auto', 'hub']]) {
    state.mode = mode; viewer.width = 380; state.edges[0].target = target; viewer.schedule(); await flush();
    assert.ok(motions().every(e => e.getAttribute('path') === viewer.scene.edges[0].path), 'motion must follow updated straight, compact and loop paths');
}
state.edges[0].animation = 'dash'; await flush();
assert.equal(motions().length, 0);
assert.equal(host.querySelectorAll('svg.links path').length, 2);
assert.equal(host.querySelectorAll('svg.links path.reverse').length, 1);
assert.ok(drawn().classList.contains('flow') && drawn().classList.contains('duplex'));
state.edges[0].direction = 'reverse'; await flush();
assert.equal(host.querySelectorAll('svg.links path').length, 1);
assert.ok(host.querySelector('svg.links path').classList.contains('reverse'));
state.edges[0].animation = 'none'; await flush();
assert.equal(drawn().classList.contains('flow'), false);
assert.equal(host.querySelectorAll('svg.links path').length, 1);
state.edges = links; state.mode = 'radial'; await flush();
host.querySelector('button').click(); await flush();
assert.equal(actions, 1); assert.equal(state.selected, ''); assert.equal(selections.length, 0);
item('a').element.click(); await flush();
assert.equal(state.selected, 'a'); assert.deepEqual(selections, ['a']);
item('a').element.click(); await flush(); assert.equal(selections.length, 1);
item('b').element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })); await flush();
assert.equal(state.selected, 'b');
state.disabled = true; await flush(); item('a').element.click(); await flush(); assert.equal(state.selected, 'b');
state.disabled = false; state.ids = ['hub', 'a']; await flush();
assert.equal(state.selected, ''); assert.equal(viewer.scene.edges.length, 1); assert.equal(observers.size, 5);
state.ids = ['hub', 'a', 'b']; await flush(); assert.equal(item('b').placed, true);
const beforeHeight = viewer.scene.height;
state.description = 'Expanded details '.repeat(12); await flush();
for (const callback of observers.values()) callback(); await flush();
assert.ok(viewer.scene.height > beforeHeight);
state.mode = 'manual'; await flush(); assert.ok(viewer.scene.nodes.every(n => Number.isFinite(n.x)));
state.invalid = true; await flush(); assert.equal(viewer.scene.nodes.length, 0);
state.invalid = false; await flush(); assert.ok([...viewer.access.items.values()].every(i => i.placed));
state.mode = 'auto'; viewer.width = 380; viewer.schedule(); await flush();
assert.equal(viewer.compact, true); assert.ok(viewer.scene.height > viewer.scene.width);
state.ids = []; await flush(); assert.equal(viewer.scene.nodes.length, 0); assert.equal(observers.size, 1);
app.unmount(); await flush(); assert.equal(viewer.access.items, null); assert.equal(observers.size, 0);
console.log('Objviewer: deterministic non-overlapping layouts, direct connections to label-inclusive boundaries, emblem-centered radial alignment, cycles/islands/manual coordinates, normalized directional dash/dot motion, live SVG path updates, Vue topology, keyboard selection, disabled/removal/resize and lifecycle cleanup passed.');

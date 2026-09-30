// Run after TypeScript compilation: npm run test:desktop
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { JSDOM } from 'jsdom';
import { computed, reactive } from 'vue';
import { copyPositions, resolveLayout, samePositions, sameValues } from '../dist/sources/control/desktop/lib/layout.js';

const options = {
    'width': 328, 'height': 328, 'cellWidth': 96, 'cellHeight': 96, 'gap': 8, 'padding': 8,
    'direction': 'column', 'snap': true, 'arrange': false, 'rtl': false
};

function checkLayout(ids, result, size = options) {
    assert.deepEqual([...result.visible, ...result.overflow].sort(), [...ids].sort());
    const points = result.visible.map(id => result.positions[id]);
    if (result.more) {
        points.push(result.more);
    }
    for (const point of points) {
        assert.ok(point.x >= size.padding && point.y >= size.padding);
        assert.ok(point.x + size.cellWidth <= size.width - size.padding);
        assert.ok(point.y + size.cellHeight <= size.height - size.padding);
    }
    for (let i = 0; i < points.length; ++i) {
        for (let j = i + 1; j < points.length; ++j) {
            const a = points[i], b = points[j];
            assert.ok(a.x + size.cellWidth + size.gap <= b.x || b.x + size.cellWidth + size.gap <= a.x ||
                a.y + size.cellHeight + size.gap <= b.y || b.y + size.cellHeight + size.gap <= a.y,
            'committed icons and overflow entry must not overlap');
        }
    }
}

// An unpositioned new item must not take a later existing item's valid anchor.
const initial = Object.freeze({
    'a': Object.freeze({ 'x': 216, 'y': 216 }),
    'b': Object.freeze({ 'x': 8, 'y': 8 }),
    'c': Object.freeze({ 'x': 112, 'y': 8 })
});
const added = resolveLayout(['new', 'a', 'b', 'c'], initial, options);
assert.deepEqual(added.positions.a, initial.a);
assert.deepEqual(added.positions.b, initial.b);
assert.deepEqual(added.positions.c, initial.c);
const reversed = resolveLayout(['c', 'b', 'a', 'new'], added.positions, options);
assert.equal(samePositions(added.positions, reversed.positions), true);
checkLayout(['new', 'a', 'b', 'c'], added);

// The pure resolver relocates invalid anchors; the controller below retains preferred positions across resizes.
const narrow = { ...options, 'width': 224 };
const shrunk = resolveLayout(['a', 'b', 'c'], initial, narrow);
assert.deepEqual(shrunk.positions.b, initial.b);
assert.deepEqual(shrunk.positions.c, initial.c);
assert.notDeepEqual(shrunk.positions.a, initial.a);
checkLayout(['a', 'b', 'c'], shrunk, narrow);
assert.equal(samePositions(resolveLayout(['a', 'b', 'c'], shrunk.positions, options).positions, shrunk.positions), true);

// Finite capacity reserves an accessible entry without losing hidden coordinates.
const many = Array.from({ 'length': 12 }, (_, i) => 'item-' + i);
const large = { ...options, 'width': 640, 'height': 536 };
const full = resolveLayout(many, {}, large);
const limited = resolveLayout(many, full.positions, options);
assert.equal(limited.visible.length, 8);
assert.equal(limited.overflow.length, 4);
for (const id of limited.overflow) {
    assert.deepEqual(limited.positions[id], full.positions[id]);
}
checkLayout(many, limited);
const expanded = resolveLayout(many, limited.positions, large);
assert.deepEqual(expanded.overflow, []);
checkLayout(many, expanded, large);
assert.equal(resolveLayout(['a', 'b'], initial, { ...options, 'width': 120, 'height': 120 }).visible.length, 0);
assert.deepEqual(resolveLayout(['a'], initial, { ...options, 'width': 20, 'height': 20 }).overflow, ['a']);
assert.deepEqual(resolveLayout([], initial, options).positions, {});

// Explicitly moved icons get their target; unaffected valid anchors are stable.
const priority = resolveLayout(['a', 'b', 'c'], {
    'a': { 'x': 8, 'y': 8 }, 'b': { 'x': 8, 'y': 8 }, 'c': { 'x': 216, 'y': 216 }
}, options, ['b']);
assert.deepEqual(priority.positions.b, { 'x': 8, 'y': 8 });
assert.deepEqual(priority.positions.c, initial.a);
checkLayout(['a', 'b', 'c'], priority);
const free = resolveLayout(['a', 'b'], { 'a': { 'x': 21, 'y': 31 } }, { ...options, 'snap': false });
assert.deepEqual(free.positions.a, { 'x': 21, 'y': 31 });
checkLayout(['a', 'b'], free, { ...options, 'snap': false });
assert.deepEqual(resolveLayout(['a'], initial, { ...options, 'arrange': true }).positions.a, { 'x': 8, 'y': 8 });
assert.deepEqual(resolveLayout(['a'], {}, { ...options, 'rtl': true }).positions.a, { 'x': 216, 'y': 8 });

// Malformed coordinates and arbitrary IDs cannot corrupt object prototypes.
const specialIds = ['__proto__', 'constructor', 'a\0b'];
const special = resolveLayout(specialIds, {}, options);
assert.equal(Object.getPrototypeOf(special.positions), Object.prototype);
assert.equal(Object.hasOwn(special.positions, '__proto__'), true);
checkLayout(specialIds, special);
const copied = copyPositions(['a', 'b', 'c'], {
    'a': { 'x': NaN, 'y': 2 }, 'b': { 'x': 8, 'y': Infinity }, 'c': { 'x': 3, 'y': 4 }
});
assert.deepEqual(copied, { 'c': { 'x': 3, 'y': 4 } });
assert.equal(samePositions({ 'a': null }, { 'a': { 'x': 8, 'y': 8 } }), false);
assert.equal(sameValues(['a\0b'], ['a', 'b']), false);

// Random layouts verify the invariant, rather than copying the placement algorithm.
let seed = 51;
function random(max) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed % max;
}
for (const snap of [true, false]) {
    for (let i = 0; i < 80; ++i) {
        const size = { ...options, 'snap': snap, 'width': 120 + random(700), 'height': 120 + random(500) };
        const ids = Array.from({ 'length': random(25) }, (_, j) => 'r-' + j);
        const positions = Object.fromEntries(ids.map(id => [id, { 'x': random(1000) - 100, 'y': random(700) - 100 }]));
        const before = structuredClone(positions);
        checkLayout(ids, resolveLayout(ids, positions, size), size);
        assert.deepEqual(positions, before);
    }
}

const dom = new JSDOM('<body></body>', { 'pretendToBeVisual': true });
const win = dom.window;
globalThis.window = win;
globalThis.document = win.document;
globalThis.MouseEvent = win.MouseEvent;
globalThis.Element = win.Element;
globalThis.HTMLElement = win.HTMLElement;
globalThis.Node = win.Node;
class PointerEvent extends win.MouseEvent {
    constructor(type, values = {}) {
        super(type, { 'bubbles': true, 'cancelable': true, ...values });
        Object.defineProperties(this, {
            'pointerId': { 'value': values.pointerId ?? 1 },
            'pointerType': { 'value': values.pointerType ?? 'mouse' },
            'isPrimary': { 'value': values.isPrimary ?? true }
        });
    }
}
win.PointerEvent = PointerEvent;
globalThis.PointerEvent = PointerEvent;
globalThis.CustomEvent = win.CustomEvent;
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
let hitElement = null;
win.document.elementFromPoint = () => hitElement;
win.document.elementsFromPoint = () => hitElement ? [hitElement] : [];
// Pointer sessions are real; omit Pointer's separate global tap translator so resource counts belong to Desktop.
const documentAdd = win.document.addEventListener.bind(win.document);
win.document.addEventListener = (type, handler, options) => {
    if (type !== 'pointerdown') {
        documentAdd(type, handler, options);
    }
};
const pointer = await import('../node_modules/@litert/pointer/dist/index.esm.js');
win.document.addEventListener = documentAdd;
const sizeHandlers = new Map();
const shown = [];
const listeners = new Map();
const addListener = win.addEventListener.bind(win);
const removeListener = win.removeEventListener.bind(win);
win.addEventListener = (type, handler, options) => {
    if (type.startsWith('pointer') || type === 'blur' || type === 'keydown') {
        if (!listeners.has(type)) {
            listeners.set(type, new Set());
        }
        listeners.get(type).add(handler);
    }
    addListener(type, handler, options);
};
win.removeEventListener = (type, handler, options) => {
    listeners.get(type)?.delete(handler);
    removeListener(type, handler, options);
};
function listenerCount() {
    return [...listeners.values()].reduce((count, list) => count + list.size, 0);
}

class AbstractControl {
    constructor() {
        this.element = win.document.createElement('div');
        this.element.setAttribute('data-cg-control', 'desktop');
        this.element.setAttribute('tabindex', '0');
        win.document.body.append(this.element);
        this.testWidth = 640;
        this.testHeight = 420;
        this.testLocale = 'ltr';
        for (const name of ['clientWidth', 'offsetWidth']) {
            Object.defineProperty(this.element, name, { 'get': () => this.testWidth });
        }
        for (const name of ['clientHeight', 'offsetHeight']) {
            Object.defineProperty(this.element, name, { 'get': () => this.testHeight });
        }
        this.element.getBoundingClientRect = () => ({
            'x': 0, 'y': 0, 'left': 0, 'top': 0, 'width': this.testWidth, 'height': this.testHeight,
            'right': this.testWidth, 'bottom': this.testHeight
        });
        this.refs = { 'pop': win.document.createElement('div'), 'itempop': win.document.createElement('div') };
        this.watchers = new Map();
        this.emitted = [];
        this.autoBind = true;
    }
    get localeDirection() {
        return this.testLocale;
    }
    propNumber(name) {
        return Number(this.props[name]);
    }
    propBoolean(name) {
        return this.props[name] === true || this.props[name] === 'true';
    }
    watch(name, handler) {
        if (!this.watchers.has(name)) {
            this.watchers.set(name, []);
        }
        this.watchers.get(name).push(handler);
    }
    trigger(name) {
        for (const handler of this.watchers.get(name) ?? []) {
            handler();
        }
    }
    nextTick() {
        return Promise.resolve();
    }
    emit(name, value) {
        this.emitted.push([name, value]);
        if (this.autoBind && name.startsWith('update:')) {
            const snapshot = structuredClone(value);
            queueMicrotask(() => {
                this.props[name.slice(7)] = snapshot;
                this.trigger(name.slice(7));
            });
        }
    }
}
const clickgo = new SyntheticModule(['control', 'dom', 'modules', 'tool', 'form'], function() {
    this.setExport('control', { AbstractControl });
    this.setExport('dom', {
        'isRtl': (element) => element.dir === 'rtl',
        'watchSizeMulti': (_current, element, handler, immediate) => {
            sizeHandlers.set(element, handler);
            if (immediate) {
                handler();
            }
        },
        'unwatchSizeMulti': (_current, element, handler) => {
            assert.equal(sizeHandlers.get(element), handler);
            sizeHandlers.delete(element);
        }
    });
    this.setExport('modules', { pointer });
    this.setExport('tool', { 'random': () => Math.random().toString(36).slice(2) });
    this.setExport('form', {
        'doFocusAndPopEvent': async () => {},
        'showPop': (target, pop, point) => {
            pop.setAttribute('data-cg-level', '0');
            shown.push({ target, pop, point });
        },
        'hidePop': pop => pop.removeAttribute('data-cg-level')
    });
});
const layoutModule = new SourceTextModule(await readFile(new URL('../dist/sources/control/desktop/lib/layout.js', import.meta.url), 'utf8'));
const controlModule = new SourceTextModule(await readFile(new URL('../dist/sources/control/desktop/code.js', import.meta.url), 'utf8'));
await controlModule.link(specifier => specifier === 'clickgo' ? clickgo : layoutModule);
await controlModule.evaluate();
const Desktop = controlModule.namespace.default;

async function makeControl(extra = {}) {
    const control = new Desktop();
    Object.assign(control.props, {
        'data': ['a', 'b', 'c', 'd'].map(id => ({ id, 'name': id })),
        'positions': {
            'a': { 'x': 8, 'y': 8 }, 'b': { 'x': 8, 'y': 112 },
            'c': { 'x': 112, 'y': 8 }, 'd': { 'x': 320, 'y': 8 }
        }, ...extra
    });
    control.element.dataset.drop = '';
    control.element.addEventListener('drop', event => control.drop(event));
    control.onMounted();
    await Promise.resolve();
    for (const id of control.visible) {
        const item = win.document.createElement('div');
        item.dataset.desktopId = id;
        control.element.append(item);
    }
    control.element.addEventListener('pointerdown', event => control.down(event, event.target.dataset.desktopId ?? ''));
    control.emitted.length = 0;
    return control;
}
function down(control, id, x, y, extra = {}) {
    hitElement = control.element;
    const target = [...control.element.children].find(item => item.dataset.desktopId === id) ?? control.element;
    target.dispatchEvent(new PointerEvent('pointerdown', { 'clientX': x, 'clientY': y, ...extra }));
}
function move(x, y, extra = {}) {
    win.document.body.dispatchEvent(new PointerEvent('pointermove', { 'clientX': x, 'clientY': y, ...extra }));
}
function up(x, y, type = 'pointerup', extra = {}) {
    win.document.body.dispatchEvent(new PointerEvent(type, { 'clientX': x, 'clientY': y, ...extra }));
}
function key(control, name, extra = {}) {
    const event = new win.KeyboardEvent('keydown', { 'key': name, 'cancelable': true, ...extra });
    Object.defineProperty(event, 'target', { 'value': control.element });
    control.keydown(event);
    return event;
}

// Real Pointer sessions: two selected icons keep their relative shape; collision is resolved.
const group = await makeControl({ 'modelValue': ['a', 'b'] });
const beforeDrag = structuredClone(group.positionsData);
const stylesBeforeDrag = group.visible.map(id => group.itemStyle(id));
down(group, 'a', 30, 30);
move(134, 30);
assert.deepEqual(group.positionsData, beforeDrag, 'dragging never repositions source or neighboring icons');
assert.deepEqual(group.visible.map(id => group.itemStyle(id)), stylesBeforeDrag, 'rendered positions stay unchanged until release');
assert.ok(document.querySelector('[data-pointer-drag]'), 'only the shared drag feedback follows the pointer');
assert.equal(group.emitted.filter(([name]) => name === 'update:positions').length, 0);
assert.deepEqual(group.dropPositions, { 'a': { 'x': 112, 'y': 8 }, 'b': { 'x': 112, 'y': 112 } });
assert.equal(group.emitted.some(([name]) => name === 'layout'), false, 'preview does not notify persistence');
const groupPreview = structuredClone(group.dropPositions);
up(134, 30);
await Promise.resolve();
assert.deepEqual(group.positionsData.a, { 'x': 112, 'y': 8 });
assert.deepEqual(group.positionsData.b, { 'x': 112, 'y': 112 });
assert.deepEqual(group.positionsData.c, { 'x': 8, 'y': 8 });
assert.deepEqual(group.positionsData.d, { 'x': 320, 'y': 8 });
assert.deepEqual(copyPositions(['a', 'b'], group.positionsData), groupPreview, 'preview matches resolved group placement');
assert.deepEqual(group.dropPositions, {}, 'release clears the preview');
assert.equal(group.emitted.filter(([name]) => name === 'update:positions').length, 1);
assert.equal(listenerCount(), 0);
assert.ok(group.emitted.some(([name, event]) => name === 'layout' && event.detail.reason === 'drag'));

// Destination previews use the shared hit target and clear over folders, overlays and auto-arrange.
const preview = await makeControl({ 'modelValue': ['a'], 'snap': false });
const previewOriginal = structuredClone(preview.positionsData);
const previewFolder = document.createElement('div');
previewFolder.dataset.drop = '';
preview.element.append(previewFolder);
const previewOverlay = document.createElement('div');
document.body.append(previewOverlay);
down(preview, 'a', 30, 30);
move(77, 61);
assert.deepEqual(preview.dropPositions.a, { 'x': 55, 'y': 39 });
assert.deepEqual(preview.positionsData, previewOriginal);
hitElement = previewFolder;
move(80, 61);
assert.deepEqual(preview.dropPositions, {}, 'a folder receives files instead of placing icons');
hitElement = previewOverlay;
move(83, 61);
assert.deepEqual(preview.dropPositions, {}, 'an overlay blocks the underlying desktop preview');
hitElement = preview.element;
move(77, 61);
const freePreview = structuredClone(preview.dropPositions);
up(77, 61);
await Promise.resolve();
assert.deepEqual(copyPositions(['a'], preview.positionsData), freePreview, 'unsnapped preview matches release');
assert.deepEqual(preview.dropPositions, {});
preview.props.autoArrange = true;
preview.trigger('autoArrange');
down(preview, 'a', 30, 30);
move(134, 30);
assert.deepEqual(preview.dropPositions, {}, 'auto-arrange permits export without a placement preview');
preview.access.stop();
preview.onBeforeUnmount();
previewOverlay.remove();
assert.equal(listenerCount(), 0);

// A parent's selection echo on the next microtask must not abort an unselected icon's drag.
const echoed = await makeControl();
down(echoed, 'c', 135, 30);
await Promise.resolve();
assert.ok(echoed.access.stop);
move(239, 30);
up(239, 30);
await Promise.resolve();
assert.deepEqual(echoed.positionsData.c, { 'x': 216, 'y': 8 });
assert.equal(listenerCount(), 0);

// Pointer cancellation, disabling, resize, Escape and unmount leave icon positions unchanged.
const cancelled = await makeControl({ 'modelValue': ['a'] });
const original = structuredClone(cancelled.positionsData);
down(cancelled, 'a', 30, 30);
move(134, 30);
up(134, 30, 'pointercancel');
assert.deepEqual(cancelled.positionsData, original);
assert.equal(cancelled.dragging, false);
assert.deepEqual(cancelled.dropPositions, {});
assert.equal(listenerCount(), 0);
assert.equal(cancelled.emitted.some(([name]) => name === 'update:positions'), false);
down(cancelled, 'a', 30, 30);
move(134, 30);
key(cancelled, 'Escape');
assert.deepEqual(cancelled.dropPositions, {});
assert.deepEqual(cancelled.positionsData, original);
assert.equal(listenerCount(), 0);
down(cancelled, 'a', 30, 30);
move(134, 30);
cancelled.props.disabled = true;
cancelled.trigger('disabled');
assert.equal(cancelled.dragging, false);
assert.deepEqual(cancelled.dropPositions, {});
assert.equal(listenerCount(), 0);
cancelled.props.disabled = false;
cancelled.trigger('disabled');
down(cancelled, 'a', 30, 30);
move(134, 30);
cancelled.testWidth = 600;
cancelled.access.resize();
assert.equal(cancelled.dragging, false);
assert.deepEqual(cancelled.dropPositions, {});
assert.equal(listenerCount(), 0);
down(cancelled, 'a', 30, 30);
move(134, 30);
cancelled.onBeforeUnmount();
assert.deepEqual(cancelled.dropPositions, {});
assert.equal(sizeHandlers.has(cancelled.element), false);
assert.equal(listenerCount(), 0);

// Framework prop echoes are quiet; removing data while hidden does not leave stale render IDs.
const hidden = await makeControl();
hidden.testWidth = 0;
hidden.access.resize();
const hiddenPosition = structuredClone(hidden.positionsData);
hidden.props.data = hidden.props.data.filter(item => item.id !== 'c');
hidden.trigger('data');
assert.equal(hidden.visible.includes('c'), false);
assert.deepEqual(hidden.positionsData.a, hiddenPosition.a);
assert.equal(Object.hasOwn(hidden.positionsData, 'c'), false);
await Promise.resolve();
hidden.testWidth = 640;
hidden.access.resize();
assert.deepEqual(hidden.positionsData.a, hiddenPosition.a);
const beforeEcho = hidden.emitted.length;
hidden.trigger('positions');
assert.equal(hidden.emitted.length, beforeEcho);


// Toggle-without-Ctrl also supports dragging a selected group and clearing on a blank click.
const toggle = await makeControl({ 'ctrl': false, 'modelValue': ['a', 'b'] });
down(toggle, 'a', 30, 30);
move(134, 30);
up(134, 30);
await Promise.resolve();
assert.deepEqual(toggle.valueData, ['a', 'b']);
assert.deepEqual(toggle.positionsData.a, { 'x': 112, 'y': 8 });
down(toggle, 'a', 134, 30);
up(134, 30);
await Promise.resolve();
assert.deepEqual(toggle.valueData, ['b']);
down(toggle, '', 500, 300);
up(500, 300);
await Promise.resolve();
assert.deepEqual(toggle.valueData, []);
toggle.onBeforeUnmount();

// Locked/automatic icons cannot be moved by the user, but application position props still work.
const locked = await makeControl();
locked.props.data[0].locked = true;
down(locked, 'a', 30, 30);
move(134, 30);
up(134, 30);
assert.deepEqual(locked.positionsData.a, { 'x': 8, 'y': 8 });
locked.props.positions = { ...locked.positionsData, 'a': { 'x': 216, 'y': 112 } };
locked.trigger('positions');
assert.deepEqual(locked.positionsData.a, { 'x': 216, 'y': 112 });
locked.props.autoArrange = true;
locked.trigger('autoArrange');
down(locked, 'b', 30, 134);
move(134, 134);
up(134, 134);
assert.equal(locked.dragging, false);

// Box selection syncs only on completion; Ctrl box selection toggles previous hits.
const box = await makeControl();
down(box, '', 2, 2);
move(108, 218);
assert.deepEqual(box.valueData, ['a', 'b']);
assert.equal(box.emitted.some(([name]) => name === 'update:modelValue'), false);
up(108, 218);
await Promise.resolve();
assert.deepEqual(box.props.modelValue, ['a', 'b']);
assert.equal(box.emitted.filter(([name]) => name === 'select').length, 1);
down(box, '', 2, 2, { 'ctrlKey': true });
move(106, 106);
up(106, 106);
await Promise.resolve();
assert.deepEqual(box.valueData, ['b']);

// Keyboard follows physical positions in RTL and leaves interactive slot descendants alone.
box.element.dir = 'rtl';
box.active = 'a';
key(box, 'ArrowRight');
assert.deepEqual(box.valueData, ['c']);
key(box, 'ArrowLeft');
assert.deepEqual(box.valueData, ['a']);
key(box, 'ArrowDown');
assert.deepEqual(box.valueData, ['b']);
key(box, 'a', { 'metaKey': true });
assert.deepEqual(box.valueData, ['a', 'b', 'c', 'd']);
key(box, 'Enter');
assert.ok(box.emitted.some(([name, event]) => name === 'open' && event.detail.value.length === 4));
const input = win.document.createElement('input');
box.element.append(input);
const childKey = new win.KeyboardEvent('keydown', { 'key': 'ArrowRight', 'cancelable': true });
Object.defineProperty(childKey, 'target', { 'value': input });
box.keydown(childKey);
assert.equal(childKey.defaultPrevented, false);
assert.equal(box.isInteractive(input), true);

// Vue caches metrics: runtime locale changes must be an observable dependency.
const locale = reactive(await makeControl());
const metrics = computed(() => locale.metrics);
assert.equal(metrics.value.rtl, false);
locale.testLocale = 'rtl';
assert.equal(metrics.value.rtl, true);
locale.onBeforeUnmount();

// Right-click retains a selected group; long press and unmount share cancellable lifetime.
box.setValue(['a', 'b']);
await Promise.resolve();
await box.context(new win.MouseEvent('contextmenu', { 'clientX': 30, 'clientY': 30 }), 'a');
assert.deepEqual(box.valueData, ['a', 'b']);
assert.equal(shown.at(-1).pop, box.refs.itempop);
key(box, 'Escape');
assert.deepEqual(box.valueData, ['a', 'b']);
assert.equal(box.refs.itempop.hasAttribute('data-cg-level'), false);
await box.context(new win.MouseEvent('contextmenu', { 'clientX': 135, 'clientY': 30 }), 'c');
assert.deepEqual(box.valueData, ['c']);
const touch = await makeControl();
down(touch, 'a', 30, 30, { 'pointerType': 'touch' });
await new Promise(resolve => setTimeout(resolve, 380));
assert.equal(shown.at(-1).pop, touch.refs.itempop);
assert.equal(listenerCount(), 0);
const shownBeforeUnmount = shown.length;
down(touch, 'a', 30, 30, { 'pointerType': 'touch' });
touch.onBeforeUnmount();
await new Promise(resolve => setTimeout(resolve, 380));
assert.equal(shown.length, shownBeforeUnmount);
assert.equal(listenerCount(), 0);

// Empty data, duplicate IDs and prototype-property IDs are handled at the control boundary.
const odd = await makeControl({ 'data': [
    { 'id': '__proto__', 'name': 'special' }, { 'id': 'constructor', 'name': 'other' },
    { 'id': '__proto__', 'name': 'duplicate' }, { 'id': '', 'name': 'missing' }
], 'positions': {} });
assert.equal(odd.items.length, 2);
assert.equal(odd.itemStyle('__proto__').left, '8px');
assert.equal(odd.contextItem, undefined);
odd.props.data = [];
odd.trigger('data');
assert.deepEqual(odd.positionsData, {});
assert.deepEqual(odd.valueData, []);
for (const control of [group, echoed, hidden, locked, box, odd]) {
    control.onBeforeUnmount();
}
assert.equal(sizeHandlers.size, 0);
assert.equal(listenerCount(), 0);

// Shrinking and expanding is temporary; model echoes cannot overwrite preferred anchors.
const restored = await makeControl();
const anchors = structuredClone(restored.props.positions);
restored.testWidth = 224;
restored.access.resize();
await Promise.resolve();
assert.notDeepEqual(restored.positionsData.d, anchors.d);
assert.deepEqual(restored.props.positions, anchors);
const compactD = { ...restored.positionsData.d };
restored.testWidth = 640;
restored.access.resize();
assert.deepEqual(restored.positionsData.d, anchors.d);
restored.testWidth = 224;
restored.access.resize();
down(restored, 'b', 30, 134);
move(134, 238);
up(134, 238);
await Promise.resolve();
const manualB = { ...restored.positionsData.b };
restored.testWidth = 640;
restored.access.resize();
assert.deepEqual(restored.positionsData.b, manualB);
assert.deepEqual(restored.positionsData.d, anchors.d);
assert.notDeepEqual(compactD, restored.positionsData.d);
assert.deepEqual(restored.emitted.filter(([name]) => name === 'layout').at(-1)[1].detail.preferredPositions,
    restored.props.positions);
restored.onBeforeUnmount();

// Invalid pointer events and explicit cancellation cannot leak drag listeners.
const occupied = document.createElement('div');
document.body.append(occupied);
pointer.drag(new PointerEvent('pointerdown'), occupied)();
assert.equal(listenerCount(), 0);
let releaseOccupied;
occupied.addEventListener('pointerdown', event => {
    releaseOccupied = pointer.scale(event, () => {}, { 'target': occupied });
    const baseline = listenerCount();
    pointer.drag(event, occupied)();
    assert.equal(listenerCount(), baseline);
});
occupied.dispatchEvent(new PointerEvent('pointerdown'));
releaseOccupied();
assert.equal(listenerCount(), 0);
occupied.remove();

// Real shared drag payload interoperates with direct pointer.drag, without committing local moves on export.
const receiver = await makeControl();
const source = await makeControl();
const sourcePositions = structuredClone(source.positionsData);
const folder = win.document.createElement('div');
folder.dataset.drop = '';
receiver.element.append(folder);
receiver.props.data[0].type = 0;
folder.addEventListener('drop', event => receiver.drop(event, 'a'));
down(source, 'c', 135, 30);
hitElement = folder;
move(700, 200);
assert.equal(folder.hasAttribute('data-hover'), true);
assert.equal(pointer.getDragData().type, 'fs');
assert.equal(pointer.getDragData().list[0].id, 'c');
up(700, 200);
assert.deepEqual(source.positionsData, sourcePositions);
const received = receiver.emitted.filter(([name]) => name === 'drop').at(-1)[1].detail;
assert.equal(received.self, false);
assert.equal(received.to.id, 'a');
assert.equal(received.from[0].id, 'c');
assert.equal(pointer.getDragData(), undefined);
assert.equal(document.querySelector('[data-pointer-drag]'), null);
assert.equal(listenerCount(), 0);

// An opaque foreground surface blocks the desktop behind it, including on release.
const blocker = win.document.createElement('div');
document.body.append(blocker);
const dropCount = receiver.emitted.filter(([name]) => name === 'drop').length;
down(source, 'c', 135, 30);
hitElement = folder;
move(700, 200);
hitElement = blocker;
up(701, 200);
assert.equal(receiver.emitted.filter(([name]) => name === 'drop').length, dropCount);
assert.deepEqual(source.positionsData, sourcePositions);

// Cancel while over a receiver never dispatches drop; Escape also removes the ghost and listeners.
down(source, 'c', 135, 30);
hitElement = folder;
move(700, 200);
win.dispatchEvent(new win.KeyboardEvent('keydown', { 'key': 'Escape', 'bubbles': true, 'cancelable': true }));
assert.equal(receiver.emitted.filter(([name]) => name === 'drop').length, dropCount);
assert.equal(folder.hasAttribute('data-hover'), false);
assert.equal(pointer.getDragData(), undefined);
assert.equal(document.querySelector('[data-pointer-drag]'), null);
assert.equal(listenerCount(), 0);
down(source, 'c', 135, 30);
hitElement = folder;
move(700, 200);
up(700, 200, 'pointercancel');
assert.equal(receiver.emitted.filter(([name]) => name === 'drop').length, dropCount);
assert.equal(listenerCount(), 0);

// Auto-arrange prevents repositioning but still permits export.
source.props.autoArrange = true;
source.trigger('autoArrange');
down(source, 'a', 30, 30);
hitElement = folder;
move(700, 200);
up(700, 200);
assert.equal(receiver.emitted.filter(([name]) => name === 'drop').length, dropCount + 1);

// An direct pointer.drag source can drop its fs payload on the new desktop background.
const legacy = document.createElement('div');
document.body.append(legacy);
legacy.addEventListener('pointerdown', event => pointer.drag(event, legacy, {
    'start': () => pointer.setDragData({ 'rand': 'legacy', 'type': 'fs', 'list': [
        { 'index': 7, 'type': 1, 'path': '/demo/from-other-task.txt' }
    ] })
}));
legacy.dispatchEvent(new PointerEvent('pointerdown', { 'clientX': 10, 'clientY': 10 }));
hitElement = receiver.element;
move(100, 100);
up(100, 100);
const legacyDrop = receiver.emitted.filter(([name]) => name === 'drop').at(-1)[1].detail;
assert.equal(legacyDrop.to, null);
assert.equal(legacyDrop.from[0].path, '/demo/from-other-task.txt');
assert.equal(legacyDrop.self, false);
assert.equal(listenerCount(), 0);

// Invalid external payloads are ignored.
const beforeInvalid = receiver.emitted.length;
for (const value of [null, false, {}, { 'type': 'fs', 'list': null }, { 'type': 'fs', 'list': [null, false] }]) {
    receiver.drop(new win.CustomEvent('drop', { 'detail': { value } }));
}
assert.equal(receiver.emitted.length, beforeInvalid);
source.onBeforeUnmount();
receiver.onBeforeUnmount();

// The workspace persists only user layout commits; Form owns viewport geometry.
const savedLayouts = [];
const workspaceClickgo = new SyntheticModule(['form', 'storage'], function() {
    this.setExport('form', { 'AbstractForm': class {} });
    this.setExport('storage', { 'set': (...args) => { savedLayouts.push(args); return true; } });
});
const workspaceData = new SourceTextModule(await readFile(
    new URL('../dist/app/demo/form/control/desktop/data.js', import.meta.url), 'utf8'));
await workspaceData.link(() => workspaceClickgo);
const iconviewStub = new SyntheticModule(['default'], function() { this.setExport('default', class {}); });
const workspaceModule = new SourceTextModule(await readFile(
    new URL('../dist/app/demo/form/solution/desktop/desktop.js', import.meta.url), 'utf8'));
await workspaceModule.link(specifier => specifier === 'clickgo' ? workspaceClickgo :
    specifier.endsWith('/data') ? workspaceData : iconviewStub);
await workspaceModule.evaluate();
const workspace = new workspaceModule.namespace.default();
const preferredPositions = { 'a': { 'x': 500, 'y': 300 } };
for (const reason of ['resize', 'positions', 'options', 'data', 'drag', 'arrange']) {
    workspace.onLayout({ 'detail': { reason, preferredPositions, 'positions': { 'a': { 'x': 8, 'y': 8 } } } });
}
assert.equal(savedLayouts.length, 2);
assert.ok(savedLayouts.every(args => args[2] === preferredPositions), 'persist preferred anchors rather than temporary display positions');

dom.window.close();
console.log('Desktop layout, overflow, stable IDs, model echo, real pointer sessions, cancellation, slots and RTL keyboard checks passed.');

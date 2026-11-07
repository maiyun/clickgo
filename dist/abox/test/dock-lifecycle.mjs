// Run after TypeScript compilation: node --experimental-vm-modules dist/abox/test/dock-lifecycle.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';

const sizeWatches = [];
const sizeUnwatches = [];
let pointerSession;
const popupCalls = [];

globalThis.getComputedStyle = () => ({});

globalThis.document = {
    'documentElement': {
        'clientWidth': 360,
        'clientHeight': 800
    }
};

class AbstractControl {
    constructor(rootForm, height) {
        this.rootForm = rootForm;
        this.element = { 'isConnected': true };
        this.refs = {
            'body': { 'clientHeight': height }
        };
    }

    watch(name, callback, options) {
        if (options?.immediate) {
            callback();
        }
    }

    async nextTick() {}

    propBoolean(name) {
        return Boolean(this.props[name]);
    }

    propNumber(name) {
        return Number(this.props[name]);
    }

    parentByName(name) {
        return this.parents?.[name] ?? null;
    }

    emit(name, value) {
        (this.events ??= []).push([name, value]);
    }
}

const clickgo = new SyntheticModule(['control', 'dom', 'modules', 'form'], function() {
    this.setExport('form', {
        showPop(...args) { popupCalls.push(['show', ...args]); },
        hidePop(...args) { popupCalls.push(['hide', ...args]); }
    });
    this.setExport('modules', { 'pointer': {
        down(event, options) {
            pointerSession = options;
            return () => options.finish(undefined, { 'cancelled': true, 'reason': 'dispose' });
        },
        move(event, options) {
            pointerSession = options;
            return { 'cancel': () => {
                options.cancelledByControl = true;
                options.finish(undefined, { 'cancelled': true, 'reason': 'dispose' });
            } };
        }
    } });
    this.setExport('control', { AbstractControl });
    this.setExport('dom', {
        getScrollInlineOffset(element) { return element.inlineOffset ?? 0; },
        setScrollInlineOffset(element, value) {
            element.inlineOffset = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, value));
        },
        watchSizeMulti(current, element, handler, immediate) {
            sizeWatches.push({ current, element, handler });
            if (immediate) {
                handler();
            }
            return true;
        },
        unwatchSizeMulti(current, element, handler) {
            sizeUnwatches.push({ current, element, handler });
        },
        watchSize(current, element, handler, immediate) {
            if (immediate) {
                handler();
            }
            return true;
        },
        isRtl(element) {
            return element.rtl;
        },
        index(element) {
            return element.order;
        }
    });
});
const widthAboxMod = new SourceTextModule(await readFile(new URL('../../sources/control/dock/abox/width.js', import.meta.url), 'utf8'));
const widthMod = new SourceTextModule(await readFile(new URL('../../sources/control/dock/lib/width.js', import.meta.url), 'utf8'));
const mod = new SourceTextModule(await readFile(new URL('../../sources/control/dock/code.js', import.meta.url), 'utf8'));
await mod.link(specifier => specifier === 'clickgo' ? clickgo : specifier === './lib/width' ? widthMod : widthAboxMod);
await mod.evaluate();
const Dock = mod.namespace.default;

const formA = { 'element': { 'isConnected': true, 'offsetWidth': 500 } };
const formB = { 'element': { 'isConnected': true, 'offsetWidth': 800 } };
const dockA1 = new Dock(formA, 300);
const dockA2 = new Dock(formA, 400);
const dockB = new Dock(formB, 500);

await dockA1.onMounted();
await dockA2.onMounted();
await dockB.onMounted();

assert.notEqual(dockA1.access, dockA2.access);
assert.notEqual(dockA1.access.formSizeWatch, dockA2.access.formSizeWatch);
assert.equal(dockA1.narrow, true);
assert.equal(dockA2.narrow, true);
assert.equal(dockB.narrow, false);
assert.equal(dockA1.floatAreaHeight, 300);
assert.equal(dockA2.floatAreaHeight, 400);
assert.equal(dockB.floatAreaHeight, 500);
assert.equal(dockA1.viewportWidth, 360);
assert.equal(dockA2.viewportWidth, 360);
assert.equal(dockB.viewportWidth, 360);

dockB.toggleFloat(1);
dockA1.toggleFloat(2);
dockA2.toggleFloat(3);
assert.equal(dockA1.floatGroup, -1);
assert.equal(dockA2.floatGroup, 3);
assert.equal(dockB.floatGroup, 1);

const dockA1Watch = dockA1.access.formSizeWatch;
const dockA1ViewportWatch = dockA1.access.viewportSizeWatch;
dockA1.onUnmounted();
assert.equal(dockA1.access.formSizeWatch, null);
assert.equal(dockA1.access.viewportSizeWatch, null);
assert.equal(sizeUnwatches.length, 2);
assert.equal(sizeUnwatches[0].current, dockA1);
assert.equal(sizeUnwatches[0].element, formA.element);
assert.equal(sizeUnwatches[0].handler, dockA1Watch.handler);
assert.equal(sizeUnwatches[1].current, dockA1);
assert.equal(sizeUnwatches[1].element, document.documentElement);
assert.equal(sizeUnwatches[1].handler, dockA1ViewportWatch.handler);
assert.equal(sizeWatches.length, 6);

// Removing only the Dock while mount awaits a tick must not leave Form/viewport listeners behind.
const removedDock = new Dock(formB, 300);
let resumeMount;
removedDock.nextTick = () => new Promise(resolve => { resumeMount = resolve; });
const mounting = removedDock.onMounted();
removedDock.element.isConnected = false;
removedDock.onUnmounted();
resumeMount();
await mounting;
assert.equal(sizeWatches.length, 6, 'an unmounted Dock cannot register new size listeners');

const resizeMod = new SourceTextModule(await readFile(new URL('../../sources/control/dock-group/abox/resize.js', import.meta.url), 'utf8'));
const groupMod = new SourceTextModule(await readFile(new URL('../../sources/control/dock-group/code.js', import.meta.url), 'utf8'));
await groupMod.link(specifier => specifier === 'clickgo' ? clickgo : resizeMod);
await groupMod.evaluate();
const DockGroup = groupMod.namespace.default;

const areaRect = {
    'left': 40,
    'right': 80,
    'top': 0,
    'bottom': 300
};
const group = new DockGroup();
group.index = 0;
group.element = {
    'rtl': false,
    'getBoundingClientRect': () => ({
        'top': 0
    })
};
group.refs = {
    'content': {
        'offsetHeight': 200
    }
};
group.dock = {
    'expandedData': false,
    'floatGroup': 0,
    'floatAreaHeight': 300,
    'viewportWidth': 360,
    'positionData': 'left',
    'widthComp': '400px',
    'getFloatArea': () => ({
        'getBoundingClientRect': () => areaRect
    })
};

group.updateFloatLayout();
assert.equal(group.floatMaxWidth, 280, 'LTR left Dock must use only the viewport space on its right');
assert.equal(group.floatStyle['max-width'], '280px');
assert.equal(group.floatStyle.height, undefined, 'short floating panels must size to their content');
group.props.grow = true;
assert.equal(group.floatStyle.height, undefined, 'grow applies to docked groups; floating panels still fit their content');
assert.equal(group.floatStyle['max-height'], '300px', 'floating panels remain bounded by available space');
group.props.grow = false;

group.element.rtl = true;
areaRect.left = 320;
areaRect.right = 360;
group.updateFloatLayout();
assert.equal(group.floatMaxWidth, 320, 'RTL left Dock must open toward the viewport space on its left');

group.dock.positionData = 'right';
areaRect.left = 0;
areaRect.right = 40;
group.updateFloatLayout();
assert.equal(group.floatMaxWidth, 320, 'RTL right Dock must open toward the viewport space on its right');

group.element.rtl = false;
group.dock.getFloatBounds = () => ({ 'left': 30, 'right': 330, 'top': 60, 'bottom': 220 });
areaRect.left = 300;
areaRect.right = 340;
group.updateFloatLayout();
assert.equal(group.floatMaxWidth, 270, 'floating panels must stay inside their Form, not only the viewport');
assert.equal(group.floatMaxHeight, '160px');
assert.equal(group.floatTop, 60);
group.dock.positionData = 'left';
group.updateFloatLayout();
assert.equal(group.floatMaxWidth, 0, 'zero available width must remain zero rather than use a fallback');
assert.equal(group.floatStyle['max-width'], '0px');

// Adjacent expanded groups exchange height, preserving the sum and their preferences on cancellation.
const firstGroup = new DockGroup();
const nextGroup = new DockGroup();
const groupOwner = { 'expandedData': true };
firstGroup.dock = nextGroup.dock = groupOwner;
firstGroup.element = { 'isConnected': true, 'getBoundingClientRect': () => ({ 'height': 180 }) };
nextGroup.element = { 'isConnected': true, 'getBoundingClientRect': () => ({ 'height': 220 }) };
firstGroup.refs = nextGroup.refs = {};
firstGroup.element.order = 1;
nextGroup.element.order = 2;
resizeMod.namespace.register(nextGroup);
resizeMod.namespace.register(firstGroup);
assert.deepEqual(firstGroup.groups, [firstGroup, nextGroup], 'registration follows DOM order');
nextGroup.element.order = 0;
resizeMod.namespace.refresh(nextGroup);
assert.deepEqual(firstGroup.groups, [nextGroup, firstGroup], 'reordering updates adjacency');
nextGroup.element.order = 2;
resizeMod.namespace.refresh(nextGroup);
assert.equal(firstGroup.canResize, true);
firstGroup.props.resizable = false;
assert.equal(firstGroup.canResize, false);
firstGroup.props.resizable = true;
nextGroup.props.resizable = false;
assert.equal(firstGroup.canResize, false, 'both groups must allow resizing');
nextGroup.props.resizable = true;
const oldSession = pointerSession;
firstGroup.resizeDown({ 'button': 2 });
assert.equal(pointerSession, oldSession, 'secondary clicks do not start resizing');
firstGroup.resizeDown({ 'button': 0, 'clientY': 100, preventDefault() {}, stopPropagation() {} });
pointerSession.move({ 'clientY': 400 });
assert.equal(firstGroup.heightData, 340);
assert.equal(nextGroup.heightData, 60);
assert.equal(firstGroup.heightData + nextGroup.heightData, 400);
pointerSession.finish(undefined, { 'cancelled': false, 'reason': 'up' });
assert.deepEqual(firstGroup.events.at(-1), ['update:height', 340]);
assert.deepEqual(nextGroup.events.at(-1), ['update:height', 60]);
firstGroup.resizeDown({ 'button': 0, 'clientY': 100, preventDefault() {}, stopPropagation() {} });
pointerSession.move({ 'clientY': 80 });
pointerSession.finish(undefined, { 'cancelled': true, 'reason': 'escape' });
assert.equal(firstGroup.heightData, 340);
assert.equal(nextGroup.heightData, 60);
firstGroup.collapsedData = true;
assert.equal(firstGroup.canResize, false);
assert.equal(firstGroup.groupStyle, undefined);
firstGroup.collapsedData = false;
assert.equal(firstGroup.groupStyle.flex, '0 1 340px', 'expanding restores the saved height');
// Reordering during a drag cancels it even when no further pointermove occurs before release.
const firstEventCount = firstGroup.events.length;
const nextEventCount = nextGroup.events.length;
firstGroup.resizeDown({ 'button': 0, 'clientY': 100, preventDefault() {}, stopPropagation() {} });
const reorderSession = pointerSession;
reorderSession.move({ 'clientY': 120 });
nextGroup.element.order = 0;
resizeMod.namespace.refresh(nextGroup);
if (!reorderSession.cancelledByControl) {
    reorderSession.finish(undefined, { 'cancelled': false, 'reason': 'up' });
}
assert.equal(firstGroup.heightData, 340, 'reordering cancels the in-progress first height');
assert.equal(nextGroup.heightData, 60, 'reordering cancels the in-progress second height');
assert.equal(firstGroup.events.length, firstEventCount);
assert.equal(nextGroup.events.length, nextEventCount);
nextGroup.element.order = 2;
resizeMod.namespace.refresh(nextGroup);

firstGroup.resizeKeydown({ 'key': 'ArrowUp', 'shiftKey': false, preventDefault() {}, stopPropagation() {} });
assert.equal(firstGroup.heightData, 170);
assert.equal(nextGroup.heightData, 230);
assert.deepEqual(firstGroup.events.at(-1), ['update:height', 170]);
resizeMod.namespace.unregister(nextGroup);
assert.equal(firstGroup.nextGroup, null, 'unmount removes the separator');
assert.deepEqual(nextGroup.groups, []);
resizeMod.namespace.unregister(firstGroup);


group.floatAreaHeight = 700;
assert.equal(group.floatMaxHeight, '700px', 'the default has no fixed 400px cap');
group.props.maxFloatHeight = 450;
assert.equal(group.floatMaxHeight, '450px');
firstGroup.slots = {};
firstGroup.refs.menu = {};
const menuTarget = { 'dataset': {} };
const menuEvent = { 'currentTarget': menuTarget, stopPropagation() {} };
firstGroup.menuClick(menuEvent);
assert.equal(popupCalls.length, 0, 'a group without a menu slot does not open a popup');
firstGroup.slots.menu = () => {};
firstGroup.menuClick(menuEvent);
assert.equal(popupCalls.at(-1)[0], 'show');
assert.equal(popupCalls.at(-1)[1], menuTarget);
assert.equal(popupCalls.at(-1)[2], firstGroup.refs.menu);
menuTarget.dataset.cgPopOpen = '';
firstGroup.menuClick(menuEvent);
assert.equal(popupCalls.at(-1)[0], 'hide');
delete menuTarget.dataset.cgPopOpen;
firstGroup.menuClick(menuEvent);
const openedMenu = firstGroup.refs.menu;
delete firstGroup.slots.menu;
firstGroup.refs.menu = undefined;
firstGroup.onUpdated();
assert.deepEqual(popupCalls.at(-1), ['hide', openedMenu], 'removing a slot closes its already-open popup');
assert.equal(firstGroup.access.menuElement, null);

// Render the actual template with and without the scoped slot in both presentation modes.
const groupTemplate = await readFile(new URL('../../sources/control/dock-group/layout.html', import.meta.url), 'utf8');
async function renderGroup(expanded, withMenu) {
    const control = {
        'template': groupTemplate,
        setup(_props, context) {
            return {
                'slots': context.slots, 'isExpanded': expanded, 'isFloating': !expanded,
                'floatPosition': 'right', 'localeDirection': 'ltr', 'isCollapsed': false,
                'canGrow': false, 'canCollapse': false, 'canResize': false,
                'groupStyle': undefined, 'floatStyle': undefined, 'formFocus': true,
                'selectedData': 'assets', 'items': [{ 'name': 'assets', 'label': 'Assets', 'icon': '' }],
                'select': () => {}, 'activateKeydown': () => {}, 'iconClick': () => {},
                'menuClick': () => {}, 'menuKeydown': () => {}, 'tabsWheel': () => {}
            };
        }
    };
    const app = createSSRApp({ render: () => h(control, {}, withMenu ? {
        'menu': ({ name }) => h('span', { 'class': 'test-menu' }, name)
    } : {}) });
    app.component('cg-tip', { render() { return h('div', this.$slots.default?.()); } });
    app.component('cg-flow', { render() { return h('div', this.$slots.default?.()); } });
    app.component('cg-svg', { render: () => h('svg') });
    app.component('cg-img', { render: () => h('img') });
    const context = {};
    const html = await renderToString(app, context);
    return html + Object.values(context.teleports ?? {}).join('');
}
for (const expanded of [true, false]) {
    assert.doesNotMatch(await renderGroup(expanded, false), /class="menu-btn"/);
    const rendered = await renderGroup(expanded, true);
    assert.match(rendered, /class="menu-btn"/);
    assert.match(rendered, /class="test-menu">assets</, 'menu slot receives the selected item name');
}

// Overflowing headers scroll without changing selection or consuming wheel events when they fit.
const tabStrip = { scrollWidth: 300, clientWidth: 100, inlineOffset: 0 };
let wheelPrevented = false;
const wheelEvent = {
    currentTarget: tabStrip, deltaX: 0, deltaY: 50,
    preventDefault() { wheelPrevented = true; }, stopPropagation() {}
};
firstGroup.localeDirection = 'ltr';
firstGroup.tabsWheel(wheelEvent);
assert.equal(tabStrip.inlineOffset, 50);
assert.equal(wheelPrevented, true);
firstGroup.localeDirection = 'rtl';
firstGroup.tabsWheel({ ...wheelEvent, deltaX: -40, deltaY: 0 });
assert.equal(tabStrip.inlineOffset, 90, 'RTL trackpad movement follows physical horizontal direction');
tabStrip.scrollWidth = 100;
wheelPrevented = false;
firstGroup.tabsWheel(wheelEvent);
assert.equal(wheelPrevented, false, 'non-overflowing headers leave wheel scrolling to their parent');




const columnMod = new SourceTextModule(await readFile(new URL('../../sources/control/dock-column/code.js', import.meta.url), 'utf8'));
await columnMod.link(() => clickgo);
await columnMod.evaluate();
const DockColumn = columnMod.namespace.default;

// A control has no mounted element during its first template render.
async function renderWidthControl(name, data) {
    const template = await readFile(new URL(`../../sources/control/${name}/layout.html`, import.meta.url), 'utf8');
    const app = createSSRApp({
        template,
        setup() {
            return {
                ...data, 'element': null, 'expandedData': true, 'positionData': 'left',
                'narrow': false, 'formFocus': true, 'propBoolean': () => true,
                'resizeWidth': () => {}, 'resizeKey': () => {}, 'toggle': () => {}
            };
        }
    });
    app.component('cg-sidebar-toggle', { render: () => h('div') });
    return renderToString(app);
}
const initialDock = new Dock({}, 0);
initialDock.layoutWidth = 1000;
const dockHtml = await renderWidthControl('dock', {
    'columns': [], 'widthData': 280, 'widthComp': '280px', 'resizeBounds': initialDock.resizeBounds
});
assert.match(dockHtml, /role="separator"[^>]*aria-valuenow="280"/);
const stringWidthHtml = await renderWidthControl('dock', {
    'columns': [], 'widthData': '240', 'widthComp': '240px', 'resizeBounds': initialDock.resizeBounds
});
assert.match(stringWidthHtml, /role="separator"[^>]*aria-valuenow="240"/);
const initialColumn = new DockColumn({}, 0);
initialColumn.widthData = '240px';
assert.equal(initialColumn.preferredWidth, 240, 'legacy CSS pixel strings remain valid column widths');
initialColumn.widthData = 280;
initialColumn.dock = initialDock;
const columnHtml = await renderWidthControl('dock-column', {
    'preferredWidth': initialColumn.preferredWidth, 'widthComp': '280px',
    'resizeBounds': initialColumn.resizeBounds, 'label': 'Column'
});
assert.match(columnHtml, /role="separator"[^>]*aria-valuenow="280"/);

document.documentElement.clientWidth = 1200;
document.documentElement.clientHeight = 900;
const multiForm = {
    'element': {
        'isConnected': true,
        'offsetWidth': 1100,
        'getBoundingClientRect': () => ({ 'left': 60, 'right': 60 + multiForm.element.offsetWidth, 'top': 30, 'bottom': 930 })
    }
};
const multiDock = new Dock(multiForm, 600);
multiDock.element.parentElement = multiForm.element;
await multiDock.onMounted();
assert.deepEqual(multiDock.getFloatBounds(), { 'left': 60, 'right': 1160, 'top': 30, 'bottom': 900 });

// Legacy CSS widths remain valid until the user drags the edge.
multiDock.widthData = '30%';
assert.equal(multiDock.widthComp, '30%');
multiDock.element.getBoundingClientRect = () => ({ 'width': 300 });
multiDock.props.position = 'right';
multiDock.props.maxWidth = 400;
multiDock.localeDirection = 'ltr';
multiDock.resizeWidth({ 'button': 0, 'clientX': 500, preventDefault() {} });
pointerSession.move({ 'clientX': 300 });
assert.equal(multiDock.widthComp, '400px', 'dragging respects an explicit maximum');
assert.equal(multiDock.events, undefined, 'dragging emits only when committed');
pointerSession.finish(undefined, { 'cancelled': true, 'reason': 'cancel' });
assert.equal(multiDock.widthComp, '30%', 'cancel restores a CSS width');
assert.equal(multiDock.events, undefined);
multiDock.resizeWidth({ 'button': 0, 'clientX': 500, preventDefault() {} });
pointerSession.move({ 'clientX': 300 });
pointerSession.finish(undefined, { 'cancelled': false, 'reason': 'up' });
assert.deepEqual(multiDock.events.at(-1), ['update:width', 400]);
multiDock.props.maxWidth = 0;

// Position changes do not fire ResizeObserver: resize must use the current viewport intersection.
const originalFormRect = multiForm.element.getBoundingClientRect;
multiForm.element.getBoundingClientRect = () => ({ 'left': 600, 'right': 1700, 'top': 30, 'bottom': 930 });
multiDock.resizeWidth({ 'button': 0, 'clientX': 500, preventDefault() {} });
pointerSession.move({ 'clientX': 0 });
assert.equal(multiDock.widthData, 280, 'drag limits refresh after a Form moves without changing size');
pointerSession.finish(undefined, { 'cancelled': true, 'reason': 'cancel' });
multiForm.element.getBoundingClientRect = originalFormRect;
multiDock.refreshLayout();

const projectColumn = new DockColumn(multiForm, 600);
const mainColumn = new DockColumn(multiForm, 600);
projectColumn.parents = mainColumn.parents = { 'dock': multiDock };
projectColumn.element = { 'order': 0 };
mainColumn.element = { 'order': 1 };
projectColumn.props.width = 220;
mainColumn.props.width = 340;
// Child groups mount before their column: both columns must allocate through the same root.
const projectIndex = projectColumn.registerGroup();
const mainIndex = mainColumn.registerGroup();
assert.notEqual(projectIndex, mainIndex);
await projectColumn.onMounted();
await mainColumn.onMounted();
assert.equal(projectColumn.expandedData, true);
assert.equal(mainColumn.expandedData, true);

// Dragging a column updates its effective width and emits the model value.
mainColumn.element.getBoundingClientRect = () => ({ 'width': 340 });
mainColumn.localeDirection = 'ltr';
multiDock.props.position = 'left';
mainColumn.resizeWidth({ 'button': 0, 'clientX': 300, preventDefault() {} });
pointerSession.move({ 'clientX': 350 });
assert.equal(mainColumn.preferredWidth, 390);
assert.equal(mainColumn.events, undefined);
assert.match(multiDock.widthComp, /390px/);
pointerSession.finish(undefined, { 'cancelled': true, 'reason': 'escape' });
assert.equal(mainColumn.preferredWidth, 340, 'cancelling restores the original width');
assert.equal(mainColumn.events, undefined, 'cancelling does not emit a model change');

// The same movement narrows a left-positioned Dock in RTL, respecting its lower bound.
mainColumn.localeDirection = 'rtl';
mainColumn.resizeWidth({ 'button': 0, 'clientX': 300, preventDefault() {} });
pointerSession.move({ 'clientX': 900 });
assert.equal(mainColumn.preferredWidth, 160);
pointerSession.finish(undefined, { 'cancelled': false, 'reason': 'up' });
assert.deepEqual(mainColumn.events.at(-1), ['update:width', 160]);
mainColumn.resizeKey({ 'key': 'ArrowLeft', preventDefault() {} });
assert.deepEqual(mainColumn.events.at(-1), ['update:width', 350]);
mainColumn.widthData = 340;
multiDock.props.position = 'right';

function resizeMultiForm(width) {
    multiForm.element.offsetWidth = width;
    multiDock.access.formSizeWatch.handler();
}
resizeMultiForm(850);
assert.equal(projectColumn.autoCollapsed, true, 'the auxiliary column collapses first');
assert.equal(mainColumn.autoCollapsed, false, 'keep the main column open when it still fits');
assert.equal(projectColumn.expandedPreference, true, 'automatic collapse must preserve user preference');
assert.equal(projectColumn.props.expanded, true);
assert.match(multiDock.widthComp, /var\(--dock-collapsed-width\).*340px/);

resizeMultiForm(650);
assert.equal(projectColumn.expandedData, false);
assert.equal(mainColumn.expandedData, false, 'collapse the main column too when workspace space is insufficient');
resizeMultiForm(1100);
assert.equal(projectColumn.expandedData, true);
assert.equal(mainColumn.expandedData, true);

document.documentElement.clientWidth = 600;
multiDock.access.viewportSizeWatch.handler();
assert.equal(projectColumn.expandedData, false);
assert.equal(mainColumn.expandedData, false, 'viewport clipping must also limit multiple expanded columns');
document.documentElement.clientWidth = 1200;
multiDock.access.viewportSizeWatch.handler();
assert.equal(mainColumn.expandedData, true);
projectColumn.toggle();
assert.equal(projectColumn.expandedPreference, false);
resizeMultiForm(650);
resizeMultiForm(1100);
assert.equal(projectColumn.expandedData, false, 'a column the user closed must remain closed after resizing');
assert.equal(mainColumn.expandedData, true);

multiDock.toggleFloat(projectIndex);
multiDock.toggleFloat(mainIndex);
assert.equal(multiDock.floatGroup, mainIndex, 'only one floating group may be open across columns');
mainColumn.unregisterGroup(mainIndex);
assert.equal(multiDock.floatGroup, -1);
multiDock.toggleFloat(projectIndex);
projectColumn.onUnmounted();
assert.equal(multiDock.columns.length, 1);
assert.equal(multiDock.floatGroup, -1, 'column removal closes its floating panel');
mainColumn.onUnmounted();
multiDock.onUnmounted();

const dockStyle = await readFile(new URL('../../sources/control/dock/style.scss', import.meta.url), 'utf8');
assert.match(dockStyle, /border-inline-end/, 'left Dock border must follow the inline end edge');
assert.match(dockStyle, /border-inline-start/, 'right Dock border must follow the inline start edge');
const toggleStyle = await readFile(new URL('../../sources/control/sidebar-toggle/style.scss', import.meta.url), 'utf8');
assert.match(toggleStyle, /:dir\(rtl\)[\s\S]*scaleX\(-1\)/, 'shared sidebar chevron must mirror in RTL');

const groupStyle = await readFile(new URL('../../sources/control/dock-group/style.scss', import.meta.url), 'utf8');
assert.match(groupStyle, /inset-inline-start:\s*100%/, 'left Dock floating panel must open toward inline end');
assert.match(groupStyle, /inset-inline-end:\s*100%/, 'right Dock floating panel must open toward inline start');

console.log('Dock lifecycle, multiple columns, preference restoration, RTL and Form/viewport bounds passed.');

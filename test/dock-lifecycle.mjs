// Run after TypeScript compilation: node --experimental-vm-modules test/dock-lifecycle.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';

const sizeWatches = [];
const sizeUnwatches = [];

globalThis.document = {
    'documentElement': {
        'clientWidth': 360
    }
};

class AbstractControl {
    constructor(rootForm, height) {
        this.rootForm = rootForm;
        this.refs = {
            'body': { 'clientHeight': height }
        };
    }

    watch(name, callback, options) {
        if ((name === 'expanded') && options?.immediate) {
            callback();
        }
    }

    async nextTick() {}

    propBoolean(name) {
        return Boolean(this.props[name]);
    }

    emit() {}
}

const clickgo = new SyntheticModule(['control', 'dom'], function() {
    this.setExport('control', { AbstractControl });
    this.setExport('dom', {
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
        }
    });
});
const mod = new SourceTextModule(await readFile(new URL('../dist/sources/control/dock/code.js', import.meta.url), 'utf8'));
await mod.link(() => clickgo);
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

const groupMod = new SourceTextModule(await readFile(new URL('../dist/sources/control/dock-group/code.js', import.meta.url), 'utf8'));
await groupMod.link(() => clickgo);
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

const dockStyle = await readFile(new URL('../dist/sources/control/dock/style.scss', import.meta.url), 'utf8');
assert.match(dockStyle, /border-inline-end/, 'left Dock border must follow the inline end edge');
assert.match(dockStyle, /border-inline-start/, 'right Dock border must follow the inline start edge');
assert.match(dockStyle, /:dir\(rtl\)[\s\S]*scaleX\(-1\)/, 'Dock chevron must mirror in RTL');

const groupStyle = await readFile(new URL('../dist/sources/control/dock-group/style.scss', import.meta.url), 'utf8');
assert.match(groupStyle, /inset-inline-start:\s*100%/, 'left Dock floating panel must open toward inline end');
assert.match(groupStyle, /inset-inline-end:\s*100%/, 'right Dock floating panel must open toward inline start');
assert.match(groupStyle, /max-width:\s*calc\(100vw - 40px\)/, 'floating panel must reserve the collapsed Dock width');

console.log('Dock lifecycle, RTL layout and viewport-bound floating-panel checks passed.');

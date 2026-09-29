// Run after TypeScript compilation: node --experimental-vm-modules test/toolbox.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<div id="tools"></div>');
globalThis.HTMLElement = dom.window.HTMLElement;
const tools = dom.window.document.getElementById('tools');
class AbstractControl {
    constructor() {
        this.refs = { tools };
        this.emitted = [];
    }
    emit(name, value) {
        this.emitted.push([name, value]);
    }
    propNumber(name) {
        return Number(this.props[name]);
    }
    watch(name, callback, options) {
        if (options?.immediate) {
            callback();
        }
    }
}
const clickgo = new SyntheticModule(['control'], function() {
    this.setExport('control', { AbstractControl });
});
const mod = new SourceTextModule(await readFile(new URL('../dist/sources/control/toolbox/code.js', import.meta.url), 'utf8'));
await mod.link(() => clickgo);
await mod.evaluate();
const Toolbox = mod.namespace.default;
const toolbox = new Toolbox();
toolbox.props.columns = '2';
toolbox.onMounted();
assert.equal(toolbox.columnsData, 2);
toolbox.toggleColumns();
assert.equal(toolbox.columnsData, 1);
assert.deepEqual(toolbox.emitted, [['update:columns', 1]]);

function button(x, y, { disabled = false, hidden = false } = {}) {
    const item = dom.window.document.createElement('div');
    item.setAttribute('data-cg-control', 'button');
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    if (disabled) {
        item.setAttribute('data-cg-disabled', '');
    }
    Object.defineProperty(item, 'offsetHeight', { 'value': hidden ? 0 : 24 });
    item.getBoundingClientRect = () => ({ 'left': x, 'top': y, 'width': 24, 'height': 24 });
    tools.append(item);
    return item;
}
// A one-tool group precedes a two-column group; DOM index arithmetic would pick the wrong row.
const browse = button(0, 0);
const paint = button(0, 40);
const erase = button(30, 40);
button(0, 80, { 'disabled': true });
button(30, 80, { 'hidden': true });
const select = button(0, 120);

function move(from, key, expected) {
    from.focus();
    let prevented = false;
    toolbox.keydown({ 'target': from, key, 'preventDefault': () => { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(dom.window.document.activeElement, expected, key);
}
move(browse, 'ArrowDown', paint);
move(paint, 'ArrowRight', erase);
move(erase, 'ArrowLeft', paint);
move(paint, 'ArrowDown', select);
move(select, 'Home', browse);
move(browse, 'End', select);
move(browse, 'ArrowUp', browse);

// RTL changes the rendered physical positions; navigation must follow those positions.
paint.getBoundingClientRect = () => ({ 'left': 30, 'top': 40, 'width': 24, 'height': 24 });
erase.getBoundingClientRect = () => ({ 'left': 0, 'top': 40, 'width': 24, 'height': 24 });
move(paint, 'ArrowLeft', erase);
move(erase, 'ArrowRight', paint);

const outside = dom.window.document.createElement('div');
outside.setAttribute('data-cg-control', 'button');
outside.setAttribute('role', 'button');
toolbox.keydown({ 'target': outside, 'key': 'ArrowDown', 'preventDefault': () => assert.fail('header/outside buttons are not tools') });
console.log('Toolbox column binding and keyboard navigation across groups, hidden/disabled tools and RTL passed.');

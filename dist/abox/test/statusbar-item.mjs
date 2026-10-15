import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

class AbstractControl {
    formFocus = true;
    events = [];
    propBoolean(name) { return this.props[name] === true || this.props[name] === 'true'; }
    emit(name) { this.events.push(name); }
}
const source = await readFile(new URL('../../sources/control/statusbar-item/code.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const module = { exports: {} };
new Function('require', 'module', 'exports', compiled)(() => ({ control: { AbstractControl } }), module, module.exports);
const Item = module.exports.default;
const item = new Item();
let prevented = 0;
const key = (value, repeat = false) => ({ key: value, repeat, preventDefault: () => ++prevented });
item.activate(key('Enter')); item.keydown(key('Enter'));
assert.equal(item.events.length, 0, 'passive items do not activate');
item.props.clickable = 'true';
item.activate(key('Enter'));
assert.equal(item.events.length, 1);
item.keydown(key('Enter'));
item.keydown(key('Enter', true));
assert.equal(item.events.length, 2, 'Enter activates once without repeat');
item.keydown(key(' '));
item.keydown(key(' ', true));
assert.equal(item.events.length, 2, 'Space waits until release');
item.keyup(key(' '));
item.keyup(key(' '));
assert.equal(item.events.length, 3, 'Space release activates once');
item.keydown(key(' '));
item.isSpaceDown = false; // blur cancels pending activation
item.keyup(key(' '));
assert.equal(item.events.length, 3);
item.props.disabled = true;
item.activate(key('Enter')); item.keydown(key('Enter')); item.keydown(key(' ')); item.keyup(key(' '));
assert.equal(item.events.length, 3, 'disabled items reject pointer and keyboard');
item.props.disabled = false;
item.keydown(key(' '));
item.props.disabled = true;
item.keyup(key(' '));
assert.equal(item.events.length, 3, 'disabling while Space is held cancels activation');
item.props.disabled = false;
item.formFocus = false;
item.keydown(key('Enter')); item.keydown(key(' ')); item.keyup(key(' '));
assert.equal(item.events.length, 3, 'inactive Forms cannot activate by keyboard');
assert.ok(prevented > 0);
console.log('Statusbar item passive, enabled, disabled, Enter, Space, repeat and focus checks passed.');

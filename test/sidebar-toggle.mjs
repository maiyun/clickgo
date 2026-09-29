// Run after TypeScript compilation: node --experimental-vm-modules test/sidebar-toggle.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';

class AbstractControl {
    constructor() {
        this.emitted = [];
        this.locale = 'sc';
    }
    propBoolean(name) {
        return [true, 'true', ''].includes(this.props[name]);
    }
    l(key) {
        return this.localeData[this.locale][key];
    }
    emit(name, value) {
        this.emitted.push([name, value]);
    }
}

const clickgo = new SyntheticModule(['control'], function() {
    this.setExport('control', { AbstractControl });
});
const mod = new SourceTextModule(await readFile(new URL('../dist/sources/control/sidebar-toggle/code.js', import.meta.url), 'utf8'));
await mod.link(() => clickgo);
await mod.evaluate();
const SidebarToggle = mod.namespace.default;
const toggle = new SidebarToggle();

for (const [position, expanded, pointsRight] of [
    ['left', false, true], ['left', true, false], ['right', false, false], ['right', true, true],
]) {
    toggle.props.position = position;
    toggle.props.expanded = expanded;
    assert.equal(toggle.chevronRight, pointsRight, `${position}, expanded=${expanded}`);
}

toggle.props.expanded = 'false';
toggle.props.label = 'Project';
assert.equal(toggle.tipLabelComp, '展开侧栏 · Project');
toggle.props.expanded = 'true';
assert.equal(toggle.tipLabelComp, '收起侧栏 · Project');
toggle.locale = 'ar';
assert.equal(toggle.tipLabelComp, 'طي الشريط الجانبي · Project');
toggle.props.tipLabel = 'Use one tool column';
assert.equal(toggle.tipLabelComp, 'Use one tool column', 'Toolbox keeps its column-specific operation');

for (const key of ['Enter', ' ']) {
    toggle.props.expanded = false;
    const count = toggle.emitted.length;
    let prevented = false;
    let stopped = false;
    const event = {
        key, 'repeat': false,
        'preventDefault': () => { prevented = true; },
        'stopPropagation': () => { stopped = true; },
    };
    toggle.keydown(event);
    assert.equal(prevented && stopped, true);
    assert.deepEqual(toggle.emitted[count], ['update:expanded', true]);
    assert.equal(toggle.props.expanded, false, 'the owner applies the requested state');
    toggle.keydown({ ...event, 'repeat': true });
    assert.equal(toggle.emitted.length, count + 1, 'holding a key must not repeatedly flip the sidebar');
}
toggle.keydown({
    'key': 'Tab',
    'preventDefault': () => assert.fail('Tab keeps native focus navigation'),
    'stopPropagation': () => assert.fail('Other keys are not consumed'),
});
toggle.props.expanded = true;
toggle.toggle();
assert.deepEqual(toggle.emitted.at(-1), ['update:expanded', false]);

console.log('Shared sidebar toggle direction, localized tips, controlled state and keyboard activation passed.');

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';

class AbstractControl {
    element = { dir: 'ltr' };
    emitted = [];
    propInt(name) { return Number(this.props[name]); }
    propBoolean(name) { return Boolean(this.props[name]); }
    emit(name, value) { this.emitted.push([name, value]); }
}
const clickgo = new SyntheticModule(['control', 'dom', 'tool'], function() {
    this.setExport('control', { AbstractControl });
    this.setExport('dom', { isRtl: element => element.dir === 'rtl' });
    this.setExport('tool', { clone: structuredClone });
});
const module = new SourceTextModule(await readFile('dist/sources/control/iconview/code.js', 'utf8'));
await module.link(() => clickgo);
await module.evaluate();
const view = new module.namespace.default();
view.props.data = Array.from({ length: 8 }, (_, i) => ({ name: 'item-' + i }));

// Resizing crosses column thresholds without stretching existing cells.
for (const [width, columns] of [[360, 2], [420, 2], [539, 2], [540, 3], [620, 3]]) {
    view.clientwidth(width);
    assert.equal(view.rowCount, columns);
    assert.equal(view.cellWidth, 180);
    assert.equal(view.dataComp[0].length, columns);
}
view.props.size = 64;
assert.equal(view.cellWidth, 144);
assert.equal(view.rowCount, 4);
view.clientwidth(100);
assert.equal(view.cellWidth, 100);
assert.equal(view.rowCount, 1);
view.clientwidth(0);
assert.ok(Number.isFinite(view.rowCount));
assert.equal(view.rowCount, 1);
view.props.size = 100;
view.clientwidth(500);

function box(x, width, modifiers = {}) {
    view.onBeforeSelect();
    view.onSelect({ x, width, y: 0, height: 100, start: 0, end: 0, empty: false, ...modifiers });
    return [...view.valueData];
}

// Column hit testing uses actual fixed cells; trailing whitespace selects nothing.
assert.deepEqual(box(190, 10), [1]);
assert.deepEqual(box(370, 80), []);
assert.equal(view.emitted.at(-1)[1].detail.area.empty, true);
assert.deepEqual(box(170, 200), [0, 1]);
assert.deepEqual(box(0, 20), [0]);
assert.deepEqual(box(370, 50, { ctrl: true }), [0]);
assert.deepEqual(box(190, 20, { shift: true }), [0, 1]);
view.arrowDown();
assert.ok(view.valueData.every(index => index >= 0 && index < 8));

// RTL starts at the right edge, leaving unused space at the left edge.
view.element.dir = 'rtl';
assert.deepEqual(box(10, 50), []);
assert.deepEqual(box(450, 20), [0]);
assert.deepEqual(box(280, 20), [1]);
assert.deepEqual(box(280, 200), [0, 1]);
view.props.multi = false;
assert.deepEqual(box(280, 20), [1]);
assert.deepEqual(box(10, 50), [1]);
view.props.data = [];
assert.deepEqual(view.dataComp, []);
console.log('Iconview fixed cells, column thresholds, size changes, narrow widths, LTR/RTL selection and modifiers passed.');

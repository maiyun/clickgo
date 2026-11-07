import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../form/notification.ts', import.meta.url), 'utf8');
const exports = {};
const area = { left: 0, top: 0, width: 800, height: 600 };
const core = { config: { locale: 'en' }, getAvailArea: () => area };
const events = [];
const entries = Array.from({ length: 100 }, (_, i) => {
    let transform = '';
    return {
        dataset: { state: i % 3 === 0 ? 'entering' : 'visible', height: 48 + i % 8 },
        style: { get transform() { return transform; }, set transform(value) { events.push('write'); transform = value; } },
        get offsetHeight() { events.push('read'); return this.dataset.height; },
    };
});
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, window: { innerWidth: 800, innerHeight: 600 },
});
const api = exports.createNotificationRuntime({ getElements: () => ({ notify: { children: entries } }), lCore: core,
    lTool: { lang: { getDirection: locale => locale === 'ar' ? 'rtl' : 'ltr' } } });
function original() {
    const rtl = core.config.locale === 'ar';
    let y = area.top + area.height - 600 - 10;
    const x = rtl ? area.left + 10 : area.left + area.width - 800 - 10;
    for (const el of entries) {
        const entering = el.dataset.state === 'entering';
        el.style.transform = `translateY(${y}px) translateX(${entering ? (rtl ? -280 : 280) : x}px)`;
        y -= el.offsetHeight + 10;
    }
}
function count(fn) {
    events.length = 0;
    fn();
    return { reads: events.filter(e => e === 'read').length, writes: events.filter(e => e === 'write').length,
        interleaved: events.some((e, i) => e === 'read' && events.slice(0, i).includes('write')) };
}
function compare(label) {
    count(original);
    const expected = entries.map(el => el.style.transform);
    entries.forEach(el => { el.style.transform = ''; });
    const initial = count(api.refreshNotifyPosition);
    assert.deepEqual(entries.map(el => el.style.transform), expected, `${label} coordinates`);
    assert.equal(initial.reads, 99);
    assert.equal(initial.writes, 100);
    assert.equal(initial.interleaved, false);
    const unchanged = count(api.refreshNotifyPosition);
    assert.deepEqual(unchanged, { reads: 99, writes: 0, interleaved: false });
}
const baseline = count(original);
assert.deepEqual(baseline, { reads: 100, writes: 100, interleaved: true });
compare('LTR entering and visible');
entries[0].dataset.state = 'leaving';
entries[1].dataset.height = 96.5;
area.height = 552;
compare('leaving and changed size');
core.config.locale = 'ar'; area.left = 50; area.width = 750;
compare('RTL');
entries[0].style.transform = 'translateX(1px)';
const repair = count(api.refreshNotifyPosition);
assert.equal(repair.writes, 1, 'external transform changes are repaired');
console.log('100 notifications: baseline 100 reads/100 writes with interleaving; optimized 99 reads/0 writes on unchanged refresh, no interleaving.');

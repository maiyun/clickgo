import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';
import ts from 'typescript';

let formatCalls = 0;
const clickgo = {
    control: { AbstractControl: class {} },
    form: { hidePop() {} },
    core: {},
    tool: { formatTime(value, tz) {
        ++formatCalls;
        const iso = new Date(value + tz * 3_600_000).toISOString();
        return { date: iso.slice(0, 10), time: iso.slice(11, 19) };
    } },
};
clickgo.modules = { clickgo };
const archiveMode = process.env.CLICKGO_DATERANGE_TEST_ARCHIVE === '1';
let DateRange, DatePanel;
if (archiveMode) {
    const archive = await JSZip.loadAsync(await readFile(new URL('../../control/common.cgc', import.meta.url)));
    const load = async name => {
        const file = archive.file(`${name}/code.js`);
        assert.ok(file, `common.cgc includes ${name}`);
        return new Function('clickgo', `${await file.async('string')}\nreturn emodule;`)(clickgo);
    };
    DateRange = await load('daterange');
    DatePanel = await load('datepanel');
}
else {
    const cache = new Map();
    const load = path => {
        path = resolve(path.replace(/\.js$/, '') + (path.endsWith('.ts') ? '' : '.ts'));
        if (cache.has(path)) return cache.get(path).exports;
        const module = { exports: {} };
        cache.set(path, module);
        const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        }).outputText;
        new Function('require', 'module', 'exports', compiled)(name => name === 'clickgo' ? clickgo : load(resolve(dirname(path), name)), module, module.exports);
        return module.exports;
    };
    const root = fileURLToPath(new URL('../../sources/control/', import.meta.url));
    DateRange = load(resolve(root, 'daterange/code')).default;
    DatePanel = load(resolve(root, 'datepanel/code')).default;
}

function prepare(control) {
    const events = [];
    const watchers = new Map();
    control.refs = { first: {}, firstpanel: { clear() {} }, endpanel: { clear() {} } };
    control.emit = (name, value) => events.push([name, value]);
    control.propBoolean = key => control.props[key] === true || control.props[key] === '' || control.props[key] === 'true';
    control.propNumber = key => Number(control.props[key]);
    control.propArray = key => Array.isArray(control.props[key]) ? control.props[key] : JSON.parse(control.props[key] || '[]');
    control.watch = (key, callback, options) => {
        if (typeof key === 'string') watchers.set(key, callback);
        if (options?.immediate) callback();
    };
    return { events, watchers };
}
const ms = value => Date.parse(value);
const range = new DateRange();
const state = prepare(range);
const realNow = Date.now;
try {
    Date.now = () => ms('2024-03-31T12:00:00Z');
    const expected = {
        today: '2024-03-31', last3days: '2024-03-29', last7days: '2024-03-25',
        thismonth: '2024-03-01', last1month: '2024-03-01', last3months: '2024-01-01', last6months: '2023-10-01',
    };
    for (const [id, start] of Object.entries(expected)) {
        state.events.length = 0;
        range.value = [];
        range.selectShortcut(id);
        assert.deepEqual(state.events.filter(e => e[0] === 'update:modelValue'), [['update:modelValue', [ms(`${start}T00:00:00Z`), ms('2024-03-31T23:59:59Z')]]], id);
        assert.equal(state.events.filter(e => e[0] === 'changed').length, 1, id);
    }
    for (const [now, tz, start, end] of [
        ['2025-01-31T12:00:00Z', 0, '2025-01-01T00:00:00Z', '2025-01-31T23:59:59Z'],
        ['2024-12-31T20:00:00Z', 5.75, '2024-12-31T18:15:00Z', '2025-01-01T18:14:59Z'],
        ['2025-01-01T02:00:00Z', -3.5, '2024-12-31T03:30:00Z', '2025-01-01T03:29:59Z'],
    ]) {
        Date.now = () => ms(now);
        range.tzData = tz;
        state.events.length = 0;
        range.selectShortcut(now.startsWith('2025-01-31') ? 'last1month' : 'today');
        assert.deepEqual(state.events.find(e => e[0] === 'update:modelValue')[1], [ms(start), ms(end)]);
    }
    Date.now = () => ms('2026-11-05T12:00:00Z');
    range.tzData = 0;
    range.props.start = String(ms('2026-11-05T03:00:00Z') / 1000);
    range.props.end = ms('2026-11-05T19:00:00.123Z');
    state.events.length = 0;
    range.selectShortcut('today');
    assert.deepEqual(state.events.find(e => e[0] === 'update:modelValue')[1], [ms('2026-11-05T03:00:00Z'), ms('2026-11-05T19:00:00.123Z')]);
    range.props.start = ms('2026-11-06T00:00:00Z');
    state.events.length = 0;
    range.selectShortcut('today');
    assert.equal(state.events.length, 0, 'disjoint range is not submitted');
    range.props.start = undefined;
    range.props.end = undefined;
    range.ts = ms('2026-11-04T00:00:00Z');
    range.cursor = '20261105';
    range.times[0].hour = ['09'];
    let prevented = false;
    state.events.length = 0;
    range.onRange({ detail: { start: range.ts, end: ms('2026-11-05T23:59:59Z') }, preventDefault() { prevented = true; } });
    assert.ok(prevented);
    assert.deepEqual(state.events.find(e => e[0] === 'update:modelValue')[1], [ms('2026-11-04T09:00:00Z'), ms('2026-11-05T23:59:59Z')]);
    assert.equal(range.ts, undefined);
    assert.equal(range.cursor, '');

    const panel = new DatePanel();
    const p = prepare(panel);
    panel.props.tz = 8;
    panel.props.jump = false;
    panel.props.modelValue = ms('2026-11-04T17:00:00Z');
    panel.onBeforeMount();
    assert.deepEqual(panel.dateValue, { year: 2026, month: 10, date: 5 });
    panel.props.modelValue = ms('2026-12-31T18:00:00Z');
    p.watchers.get('modelValue')();
    assert.deepEqual(panel.dateValue, { year: 2027, month: 0, date: 1 });
    Date.now = () => ms('2026-11-04T17:00:00Z');
    panel.props.disabledList = [];
    panel.startTs = ms('2026-11-04T18:00:00Z');
    panel.endTs = ms('2026-11-05T15:59:59Z');
    panel.startDate.setTime(panel.startTs + 8 * 3_600_000); panel.refreshStartValue();
    panel.endDate.setTime(panel.endTs + 8 * 3_600_000); panel.refreshEndValue();
    panel.vhour = ['00']; panel.vminute = ['00']; panel.vseconds = ['00'];
    panel.today();
    assert.equal(panel.timestamp, panel.startTs, 'today clamps time to start');
    panel.props.disabledList = ['20261105'];
    const before = panel.timestamp;
    panel.today();
    assert.equal(panel.timestamp, before, 'disabled today leaves selection unchanged');
    panel.props.disabledList = [];
    panel.props.disabled = true;
    panel.today();
    assert.equal(panel.timestamp, before, 'disabled panel leaves selection unchanged');
}
finally { Date.now = realNow; }
console.log(`Date range (${archiveMode ? 'archive' : 'source'}) regression passed.`);

// Exercise actual component templates and Vue watcher scheduling. jsdom does not verify layout.
const { JSDOM } = await import('jsdom');
const { clone, getClassPrototype } = await import('../../lib/tool.js');
const dom = new JSDOM('<!doctype html><html><body><system></system></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
const { createApp, h, reactive, nextTick } = await import('vue');
Object.assign(clickgo.control.AbstractControl.prototype, {
    watch(source, callback, options) { return this.$watch(typeof source === 'string' ? () => this.props[source] : source, callback, options); },
    emit(...args) { this.$emit(...args); },
    nextTick() { return this.$nextTick(); },
    propBoolean(name) { return [true, 'true', ''].includes(this.props[name]); },
    propNumber(name) { return Number(this.props[name]); },
    propArray(name) { return Array.isArray(this.props[name]) ? this.props[name] : [this.props[name]]; },
    l(key) { return this.localeData?.en[key] ?? key; },
});
Object.defineProperty(clickgo.control.AbstractControl.prototype, 'refs', { get() { return this.$refs; } });
let width = 900;
clickgo.core.getAvailArea = () => ({ width });
let openElement;
clickgo.form.showPop = el => { openElement = el; el.dataset.cgPopOpen = ''; };
clickgo.form.hidePop = el => { el ??= openElement; if (el) delete el.dataset.cgPopOpen; openElement = undefined; };
clickgo.modules.pointer = { hover() {} };
const errors = [];
process.on('unhandledRejection', error => errors.push(error));
const zip = archiveMode ? await JSZip.loadAsync(await readFile(new URL('../../control/common.cgc', import.meta.url))) : null;
async function component(name, Control) {
    const instance = new Control();
    const proto = getClassPrototype(instance);
    const template = archiveMode ? await zip.file(`${name}/layout.html`).async('string') : await readFile(new URL(`../../sources/control/${name}/layout.html`, import.meta.url), 'utf8');
    return {
        template,
        props: Object.fromEntries(Object.entries(instance.props).map(([key, value]) => [key, { default: () => clone(value) }])),
        emits: instance.emits,
        data: () => clone(Object.fromEntries(Object.entries(instance).filter(([key]) => !['props', 'emits'].includes(key)))),
        computed: proto.access,
        methods: proto.method,
        created() { this.props = this.$props; this.slots = this.$slots; },
        beforeMount() { this.onBeforeMount?.(); },
        async mounted() { await this.$nextTick(); this.onMounted?.(); },
    };
}
const rangeComponent = await component('daterange', DateRange);
const panelComponent = await component('datepanel', DatePanel);
const stub = { props: ['modelValue', 'disabled', 'data'], emits: ['update:modelValue'], template: '<button :disabled="disabled"><slot></slot></button>' };
async function flush() {
    for (let i = 0; i < 12; ++i) await nextTick();
    assert.deepEqual(errors, []);
}
async function mountRange(screenWidth) {
    width = screenWidth;
    const state = reactive({ modelValue: [], tz: 8, time: true, zone: true });
    const events = [];
    const app = createApp({
        render() { return h(rangeComponent, {
            ...state, ref: 'range',
            'onUpdate:modelValue': value => { state.modelValue = value; },
            'onUpdate:tz': value => { state.tz = value; },
            onChanged: () => events.push('changed'),
        }); },
    });
    app.component('cg-datepanel', panelComponent);
    app.component('cg-button', stub);
    app.component('cg-select', stub);
    app.component('cg-list', stub);
    const host = document.createElement('div'); document.body.append(host);
    const root = app.mount(host);
    await flush();
    return { app, root, state, events, host };
}
const fixture = await mountRange(900);
const ui = fixture.root.$refs.range;
assert.equal(ui.datePanelsMounted, false, 'panels are lazy');
formatCalls = 0;
await ui.click('first'); await flush();
assert.ok(ui.$refs.firstpanel && ui.$refs.endpanel, 'opening mounts both panels');
assert.equal(ui.showTwoDatePanel, true);
const first = ui.$refs.firstpanel;
const end = ui.$refs.endpanel;
const col = (year, month, date) => ({ year, month: month - 1, date, time: Date.UTC(year, month - 1, date) - 8 * 3_600_000, day: 0, str: '' });
ui.times[0].hour = ['09']; ui.times[0].minute = ['15'];
ui.times[1].hour = ['18']; ui.times[1].minute = ['00']; ui.times[1].second = ['00'];
first.colClick(col(2026, 11, 4)); await flush();
assert.equal(ui.ts, ms('2026-11-03T16:00:00Z'));
first.colClick(col(2026, 11, 4)); await flush();
assert.deepEqual([...fixture.state.modelValue], [ms('2026-11-04T01:15:00Z'), ms('2026-11-04T10:00:00Z')], 'same day respects both times');
assert.equal(fixture.events.length, 1);
assert.equal(formatCalls, 2, 'feedback formats each endpoint once');
await ui.click('first'); await flush();
first.colClick(col(2026, 11, 4)); await flush();
end.colClick(col(2026, 11, 6)); await flush();
assert.deepEqual([...fixture.state.modelValue], [ms('2026-11-04T01:15:00Z'), ms('2026-11-06T10:00:00Z')]);
await ui.click('first'); await flush();
ui.selectShortcut('today'); await flush();
const shortcutCount = fixture.events.length;
await ui.click('first'); await flush();
ui.selectShortcut('today'); await flush();
assert.equal(fixture.events.length, shortcutCount, 'same shortcut does not notify');
await ui.click('first'); await flush();
first.colClick(col(2026, 11, 4)); await flush();
ui.cancel();
await ui.click('first'); await flush();
assert.equal(ui.ts, undefined, 'reopening discards uncommitted selection');
fixture.state.modelValue = [ms('2026-12-31T18:00:00Z'), ms('2027-01-01T10:00:00Z')]; await flush();
assert.equal(ui.display[0].date, '2027-01-01');
await ui.click('zone'); await flush();
ui.vzone = ['+5']; ui.vzdec = ['30']; ui.cancel();
await ui.click('zone'); await flush();
assert.deepEqual([...ui.vzone], ['+8'], 'canceled timezone draft resets');
const count = fixture.events.length;
ui.zoneOk(); await flush();
assert.equal(fixture.events.length, count, 'same timezone does not notify');
await ui.click('zone'); await flush();
ui.vzone = ['+5']; ui.vzdec = ['30'];
ui.zoneOk(); await flush();
assert.equal(fixture.events.length, count + 1, 'tz feedback submits once');
assert.equal(ui.display[0].date, '2027-01-01');
assert.deepEqual([...fixture.state.modelValue], [ms('2026-12-31T20:30:00Z'), ms('2027-01-01T12:30:00Z')]);
const incoming = [ms('2028-01-03T00:00:00Z'), ms('2028-01-04T00:00:00Z')];
const beforeExternal = fixture.events.length;
fixture.state.modelValue = incoming; fixture.state.tz = -3.5; await flush();
assert.deepEqual([...fixture.state.modelValue], incoming, 'simultaneous external value and tz retain supplied value');
assert.deepEqual([...ui.value], incoming);
assert.equal(fixture.events.length, beforeExternal);
fixture.state.modelValue = [...incoming]; await flush();
assert.equal(fixture.events.length, beforeExternal, 'same external value does not notify');
fixture.state.tz = -2.5; await flush();
assert.deepEqual([...fixture.state.modelValue], incoming.map(value => value - 3_600_000), 'external tz preserves wall time');
fixture.state.start = String(ms('2028-01-02T21:30:00Z') / 1000);
fixture.state.end = ms('2028-01-03T20:59:59.123Z'); await flush();
await ui.click('zone'); await flush();
ui.vzone = ['-0']; ui.vzdec = ['30']; ui.zoneOk(); await flush();
assert.deepEqual([...fixture.state.modelValue], [ms('2028-01-02T21:30:00Z'), ms('2028-01-03T20:59:59.123Z')], 'user timezone change clamps second and millisecond bounds');
fixture.state.start = ms('2030-01-01T00:00:00Z'); await flush();
const boundedValue = [...fixture.state.modelValue];
const boundedTz = fixture.state.tz;
await ui.click('zone'); await flush();
ui.vzone = ['+8']; ui.vzdec = ['00']; ui.zoneOk(); await flush();
assert.deepEqual([...fixture.state.modelValue], boundedValue, 'disjoint zone change preserves value');
assert.equal(fixture.state.tz, boundedTz);
ui.cancel(); fixture.state.start = undefined; fixture.state.end = undefined; await flush();
await ui.click('zone'); await flush();
assert.ok(ui.zones.includes('-0'));
ui.vzone = ['-0']; ui.vzdec = ['30']; ui.zoneOk(); await flush();
assert.equal(fixture.state.tz, -0.5);
assert.ok(Number.isFinite(ui.$refs.firstpanel.tzData) && Number.isFinite(ui.$refs.firstpanel.startTs) && Number.isFinite(ui.$refs.firstpanel.endTs));
assert.notEqual(ui.$refs.firstpanel.isDisabled(col(2026, 11, 4)), '', 'calendar remains selectable after negative fractional timezone and boundary changes');
// Mutating the same array and changing tz in one tick must honor the new timestamps.
fixture.state.modelValue = [ms('2029-01-01T00:00:00Z'), ms('2029-01-02T00:00:00Z')]; await flush();
const mutable = fixture.state.modelValue;
mutable[0] = ms('2029-03-01T00:00:00Z');
mutable[1] = ms('2029-03-02T00:00:00Z');
fixture.state.tz = 6;
const mutationCount = fixture.events.length;
await flush();
assert.deepEqual([...ui.value], [...mutable], 'in-place mutation with tz honors external value');
assert.equal(fixture.events.length, mutationCount);
// Wide to narrow reopens with the stale right panel removed.
await ui.click('first'); await flush();
ui.cancel(); width = 400;
await ui.click('first'); await flush();
assert.ok(!ui.$refs.endpanel, 'wide to narrow removes right panel');
ui.cancel(); width = 900;
await ui.click('first'); await flush();
assert.ok(ui.$refs.endpanel, 'narrow to wide restores right panel');
ui.cancel();
fixture.app.unmount(); fixture.host.remove();
const narrow = await mountRange(400);
const small = narrow.root.$refs.range;
await small.click('first'); await flush();
assert.equal(small.showTwoDatePanel, false);
assert.equal(small.$refs.endpanel, undefined, 'single screen does not mount second panel');
small.times[0].hour = ['09']; small.times[0].minute = ['15'];
small.times[1].hour = ['18']; small.times[1].minute = ['00']; small.times[1].second = ['00'];
small.$refs.firstpanel.colClick(col(2026, 11, 4)); await flush();
small.$refs.firstpanel.colClick(col(2026, 11, 6)); await flush();
assert.deepEqual([...narrow.state.modelValue], [ms('2026-11-04T01:15:00Z'), ms('2026-11-06T10:00:00Z')]);
// An invalid same-day time range remains editable and can be retried.
await small.click('first'); await flush();
small.times[0].hour = ['18']; small.times[1].hour = ['09'];
small.$refs.firstpanel.colClick(col(2026, 11, 4)); await flush();
const oldValue = [...narrow.state.modelValue];
small.$refs.firstpanel.colClick(col(2026, 11, 4)); await flush();
assert.deepEqual([...narrow.state.modelValue], oldValue, 'invalid time range is not submitted');
small.times[1].hour = ['19'];
small.$refs.firstpanel.colClick(col(2026, 11, 4)); await flush();
assert.deepEqual([...narrow.state.modelValue], [ms('2026-11-04T10:15:00Z'), ms('2026-11-04T11:00:00Z')], 'invalid time range can be corrected and retried');
narrow.state.time = false; await flush();
await small.click('first'); await flush();
small.$refs.firstpanel.colClick(col(2026, 11, 4)); await flush();
small.$refs.firstpanel.colClick(col(2026, 11, 6)); await flush();
assert.deepEqual([...narrow.state.modelValue], [ms('2026-11-03T16:00:00Z'), ms('2026-11-06T15:59:59Z')], 'date-only mode uses full days');
narrow.app.unmount(); narrow.host.remove();
const draftFixture = await mountRange(900);
const draftControl = draftFixture.root.$refs.range;
draftFixture.state.modelValue = [ms('2026-11-01T00:00:00Z'), ms('2026-11-02T00:00:00Z')]; await flush();
await draftControl.click('first'); await flush();
draftControl.$refs.firstpanel.colClick(col(2026, 11, 4)); await flush();
assert.notEqual(draftControl.ts, undefined, 'date draft exists before external timezone update');
const equalValue = [...draftFixture.state.modelValue];
const draftChangeCount = draftFixture.events.length;
draftFixture.state.modelValue = [...equalValue]; draftFixture.state.tz = 4; await flush();
assert.equal(draftControl.ts, undefined, 'timezone update clears draft even with an equal new model array');
assert.deepEqual([...draftControl.value], equalValue, 'equal external array remains authoritative');
assert.equal(draftFixture.events.length, draftChangeCount, 'external change emits no changed event');
draftFixture.app.unmount(); draftFixture.host.remove();
for (const tz of [-0.5, -3.5]) {
    const negative = await mountRange(900);
    negative.state.tz = tz; await flush();
    const control = negative.root.$refs.range;
    await control.click('first'); await flush();
    const calendar = control.$refs.firstpanel;
    assert.equal(calendar.tzData, tz, `panel preserves ${tz} timezone`);
    assert.ok(calendar.zones.includes('-0'));
    assert.equal(calendar.vzone[0], tz === -0.5 ? '-0' : '-3');
    assert.equal(calendar.vzdec[0], '30');
    assert.ok(Number.isFinite(calendar.startTs) && Number.isFinite(calendar.endTs));
    assert.ok(calendar.maps.flat().length > 0 && calendar.maps.flat().every(day => Number.isFinite(day.time)), 'calendar map timestamps are finite');
    const date = col(2026, 11, 4);
    date.time = Date.UTC(2026, 10, 4) - tz * 3_600_000;
    assert.notEqual(calendar.isDisabled(date), '');
    calendar.colClick(date); await flush();
    assert.equal(control.ts, date.time, 'negative timezone date selection works');
    negative.app.unmount(); negative.host.remove();
}
console.log(`Date range Vue scheduling (${archiveMode ? 'archive' : 'source'}) passed; jsdom does not validate visual layout.`);

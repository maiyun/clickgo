import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import ts from 'typescript';

let hidden = 0;
const clickgo = {
    control: { AbstractControl: class {} },
    form: { hidePop() { ++hidden; } },
};
clickgo.modules = { clickgo };
const useArchive = process.env.CLICKGO_DATE_TEST_ARCHIVE === '1';
let DateControl;
if (useArchive) {
    const archive = await JSZip.loadAsync(await readFile(new URL('../../control/common.cgc', import.meta.url)));
    const file = archive.file('date/code.js');
    assert.ok(file, 'The common control package includes Date');
    DateControl = new Function('clickgo', `${await file.async('string')}\nreturn emodule;`)(clickgo);
}
else {
    const source = await readFile(new URL('../../sources/control/date/code.ts', import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const module = { exports: {} };
    new Function('require', 'module', 'exports', compiled)(() => clickgo, module, module.exports);
    DateControl = module.exports.default;
}

const cases = [
    { tz: 0, initial: '2026-10-21T01:02:03.456Z', empty: true, date: '2026-10-21', choices: [
        ['143045', '2026-10-21T14:30:45.000Z'],
        ['000000', '2026-10-21T00:00:00.000Z'],
    ] },
    { tz: 8, initial: '2026-10-21T02:03:04.567Z', date: '2026-10-21', choices: [
        ['001500', '2026-10-20T16:15:00.000Z'],
        ['235959', '2026-10-21T15:59:59.000Z'],
    ] },
    { tz: 5.75, initial: '2026-12-31T22:00:00.999Z', date: '2027-01-01', choices: [
        ['001530', '2026-12-31T18:30:30.000Z'],
    ] },
    { tz: -3.5, initial: '2026-10-21T23:00:00.123Z', date: '2026-10-21', choices: [
        ['235959', '2026-10-22T03:29:59.000Z'],
    ] },
];

let selections = 0;
for (const scenario of cases) {
    const control = new DateControl();
    control.tzData = scenario.tz;
    control.timestamp = scenario.empty ? undefined : Date.parse(scenario.initial);
    control.dateObj = new Date(Date.parse(scenario.initial) + scenario.tz * 3_600_000);
    for (const [time, iso] of scenario.choices) {
        const before = control.timestamp;
        const expected = Date.parse(iso);
        const events = [];
        const hiddenBefore = hidden;
        control.emit = (name, value) => {
            assert.equal(hidden, hiddenBefore, 'The popup closes after all value notifications');
            assert.equal(control.timestamp, expected, 'Observers see the newly selected timestamp');
            events.push([name, value]);
        };
        control.vhour = [time.slice(0, 2)];
        control.vminute = [time.slice(2, 4)];
        control.vseconds = [time.slice(4, 6)];
        control.timeOk();
        assert.equal(control.timestamp, expected);
        assert.equal(control.dateStr, scenario.date, 'Selecting time preserves the date in the selected timezone');
        assert.equal(control.timeStr, `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}`);
        assert.equal(control.dateObj.getUTCMilliseconds(), 0);
        assert.deepEqual(events, [
            ['update:modelValue', expected],
            ['update:hourminute', time],
            ['changed', { detail: { before, value: expected } }],
        ]);
        assert.equal(hidden, hiddenBefore + 1);
        ++selections;
    }
}
console.log(`Date time selection (${useArchive ? 'archive' : 'source'}) passed: ${selections} selections covering empty values, repeated changes, UTC, fractional timezones and date boundaries.`);

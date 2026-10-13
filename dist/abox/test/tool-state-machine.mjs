import assert from 'node:assert/strict';
import { stateMachine, ESTATE } from '../../lib/tool.js';

function scan(code, start = 0, stop = Infinity) {
    const events = [];
    stateMachine(code, start, event => {
        events.push({ ...event, pre: { ...event.pre }, bracket: { ...event.bracket } });
        return events.length < stop;
    });
    return events;
}

const events = scan('a("x"); // y\nb');
assert.deepEqual(events.map(({ state, start, end, word }) => [state, start, end, word]), [
    [ESTATE.WORD, 0, 0, 'a'],
    [ESTATE.NORMAL, 1, 1, '('],
    [ESTATE.STRING, 2, 4, '"x"'],
    [ESTATE.NORMAL, 5, 7, '); '],
    [ESTATE.COMMENT, 8, 11, '// y'],
    [ESTATE.NORMAL, 12, 12, '\n'],
    [ESTATE.WORD, 13, 13, 'b'],
]);
assert.deepEqual(events[2].bracket, { s: 1, m: 0, l: 0 });
assert.deepEqual(events[3].bracket, { s: 0, m: 0, l: 0 });
assert.deepEqual(events[6].pre, { state: ESTATE.NORMAL, word: '\n', nonnull: '// y' });
assert.deepEqual(scan('a("x"); // y\nb', 0, 3), events.slice(0, 3));
assert.deepEqual(scan('xx $value_12', 3).filter(event => event.state === ESTATE.WORD).map(event => event.word), ['$value_12']);
assert.deepEqual(scan('a\r\nb\rc'), scan('a\nb\nc'));
assert.deepEqual(scan('a\r\r\nb'), scan('a\n\nb'));
assert.deepEqual(scan(''), []);

const words = code => scan(code).filter(event => event.state === ESTATE.WORD).map(event => event.word);
assert(!words('const text="eval"; /* eval */ // eval\nreturn /eval/g;').includes('eval'));
assert(words('eval("value")').includes('eval'));
assert.deepEqual(scan(String.raw`return /[a-z\/]+/giu;`).filter(event => event.state === ESTATE.REG).map(event => event.word),
    [String.raw`/[a-z\/]+/giu`]);
for (let code = 0; code < 128; ++code) {
    const char = String.fromCharCode(code);
    assert.equal(words(char).length > 0, /[$\w]/.test(char));
    if (char === '/' || char === '[' || char === ']') {
        continue;
    }
    const regular = scan(`return /a/${char};`).find(event => event.state === ESTATE.REG);
    assert.equal(regular.word, `/a/${/\w/.test(char) ? char : ''}`);
}
for (const char of ['字', 'é', '\u00a0', '\u2028', '\u2029', '\ud83e']) {
    assert.equal(words(char).length, 0);
}

const retained = [];
stateMachine('a(b)', 0, event => { retained.push(event); return true; });
assert(retained.every(event => event.bracket === retained[0].bracket));
assert(retained.every((event, index) => index === 0 || event.pre !== retained[index - 1].pre));
console.log('State-machine tokens, offsets, previous state, brackets, newline normalization, stop and eval classification passed.');

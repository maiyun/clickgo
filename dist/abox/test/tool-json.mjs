import assert from 'node:assert/strict';
import vm from 'node:vm';
import { isJson } from '../../lib/tool.js';

for (const value of [null, false, true, 0, -1.5, '', 'not JSON text', '{broken', [], {},
    [1, 'value', null], { nested: { values: [true, 1] } }, Object.create(null),
    vm.runInNewContext('({ nested: [1, null] })')]) {
    assert.equal(isJson(value), true);
}

class RecordValue { value = 1; }
for (const value of [undefined, NaN, Infinity, -Infinity, 1n, Symbol('value'), () => null,
    new Date(), new Map(), new Set(), new RecordValue(), Object(1),
    { value: undefined }, [undefined], [,], new Array(2)]) {
    assert.equal(isJson(value), false);
}

const shared = { value: 1 };
assert.equal(isJson({ first: shared, second: shared }), true);
shared.self = shared;
assert.equal(isJson(shared), false);
const cyclicArray = [];
cyclicArray.push(cyclicArray);
assert.equal(isJson(cyclicArray), false);
const extendedArray = [1];
extendedArray.extra = 2;
assert.equal(isJson(extendedArray), false);
const disguisedSparse = new Array(1);
disguisedSparse.extra = 1;
assert.equal(isJson(disguisedSparse), false);
assert.equal(isJson(Object.defineProperty([1], '0', { enumerable: false })), false);
assert.equal(isJson(Object.assign([1], { [Symbol('key')]: 2 })), false);

const getter = { get value() { assert.fail('A JSON check must not invoke a data getter'); } };
assert.equal(isJson(getter), false);
const tagged = { get [Symbol.toStringTag]() { assert.fail('A rejected Symbol getter must not run'); } };
assert.equal(isJson(tagged), false);
assert.equal(isJson({ [Symbol('key')]: 1 }), false);
assert.equal(isJson(Object.defineProperty({}, 'hidden', { value: 1 })), false);
assert.equal(isJson({ toJSON() { assert.fail('A JSON check must not invoke toJSON'); } }), false);

let nested = 1;
for (let depth = 0; depth < 64; ++depth) nested = { nested };
assert.equal(isJson(nested), true);
assert.equal(isJson({ nested }), false);
assert.equal(isJson({ value: 1 }), true);

console.log('tool JSON value checks passed');

// Run after TypeScript compilation: node test/tool-clone.mjs
import assert from 'node:assert/strict';
import { clone } from '../dist/lib/tool.js';

const shared = { 'value': 1 };
const source = {
    'map': new Map(),
    'set': new Set(),
    shared,
    'alias': shared,
    'date': new Date('2026-09-20T00:00:00.000Z'),
};
source.self = source;
source.map.set(shared, source);
source.set.add(shared);
source.set.add(source);

const first = clone(source);
const second = clone(source);

assert.notEqual(first, source);
assert.notEqual(first, second);
assert(first.map instanceof Map);
assert(first.set instanceof Set);
assert.notEqual(first.map, source.map);
assert.notEqual(first.map, second.map);
assert.notEqual(first.set, source.set);
assert.notEqual(first.set, second.set);
assert.equal(first.self, first);
assert.equal(first.shared, first.alias);
assert.notEqual(first.shared, shared);
assert.equal(first.map.get(first.shared), first);
assert(first.set.has(first.shared));
assert(first.set.has(first));
assert(first.date instanceof Date);
assert.notEqual(first.date, source.date);
assert.equal(first.date.getTime(), source.date.getTime());

first.map.set('only-first', true);
assert.equal(second.map.has('only-first'), false);

console.log('Tool clone Map/Set, circular-reference and instance-isolation checks passed.');

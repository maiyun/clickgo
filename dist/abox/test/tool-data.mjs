import assert from 'node:assert/strict';
import { compar, getClassPrototype, parseArrayString } from '../../lib/tool.js';

assert.deepEqual(compar([], []), { remove: {}, add: {}, length: { remove: 0, add: 0 } });
assert.deepEqual(compar([1, '1', 2, 2], [3, 3]), {
    remove: { 1: 1, 2: 3 }, add: { 3: 1 }, length: { remove: 4, add: 2 },
});
assert.deepEqual(compar([NaN, 0, '0'], [NaN, -0]), {
    remove: { 0: 2 }, add: {}, length: { remove: 1, add: 0 },
});
const before = Array.from({ length: 256 }, (_, index) => index);
const after = Array.from({ length: 256 }, (_, index) => index + 128);
const delta = compar(before, after);
assert.equal(delta.length.remove, 128);
assert.equal(delta.length.add, 128);
for (let index = 0; index < 128; ++index) {
    assert.equal(delta.remove[index], index);
    assert.equal(delta.add[index + 256], index + 128);
}
assert.deepEqual(before, Array.from({ length: 256 }, (_, index) => index));
assert.deepEqual(after, Array.from({ length: 256 }, (_, index) => index + 128));
const mixed = Array.from({ length: 128 }, (_, index) => index % 2 ? '1' : 1);
assert.deepEqual(compar(mixed, Array(128).fill(1)), {
    remove: { 1: 127 }, add: {}, length: { remove: 64, add: 0 },
});

class Parent {
    base() { return 'base'; }
    shared() { return 'parent'; }
    shadow() { return 'parent'; }
    get value() { return this.stored ?? 1; }
    set value(value) { this.stored = value; }
}
class Child extends Parent {
    shared() { return 'child'; }
    get readOnly() { return 'read-only'; }
    set writeOnly(value) { this.written = value; }
}
Object.defineProperty(Child.prototype, 'shadow', { value: 0 });
const instance = new Child();
const prototype = getClassPrototype(instance);
assert.deepEqual(Object.keys(prototype.method), ['shared', 'base']);
assert.deepEqual(Object.keys(prototype.access), ['readOnly', 'writeOnly', 'value']);
assert.equal(prototype.method.shared, Child.prototype.shared);
assert.equal(prototype.method.base, Parent.prototype.base);
assert.equal(prototype.access.value.get, Object.getOwnPropertyDescriptor(Parent.prototype, 'value').get);
prototype.access.value.set.call(instance, 7);
assert.equal(prototype.access.value.get.call(instance), 7);
prototype.access.writeOnly.set.call(instance, 8);
assert.equal(instance.written, 8);
assert.equal(prototype.access.writeOnly.get.call(instance), undefined);
assert.equal(prototype.access.readOnly.set.call(instance, 9), undefined);
const ignored = ['base'];
assert.deepEqual(Object.keys(getClassPrototype(instance, ignored).method), ['shared']);
assert.deepEqual(ignored, ['base', 'shared', 'readOnly', 'writeOnly', 'shadow', 'value']);
assert.deepEqual(Object.keys(getClassPrototype(Child.prototype, [], 1).method), ['shared', 'base']);
class Stop extends Parent { toString() { return 'stop'; } }
assert.deepEqual(getClassPrototype(new Stop()), { method: {}, access: {} });
class NamedPrototype { ['__proto__']() {} inherited() {} }
class NamedChild extends NamedPrototype { own() {} }
const named = getClassPrototype(new NamedChild());
assert.equal(Object.getPrototypeOf(named.method), Object.prototype);
assert.deepEqual(Object.keys(named.method), ['own', 'inherited']);
assert.equal(Object.getPrototypeOf(getClassPrototype(new NamedPrototype()).method), NamedPrototype.prototype.__proto__);

assert.deepEqual(parseArrayString('[]'), []);
assert.deepEqual(parseArrayString(' [ a, , b, ] '), ['a', 'b']);
assert.deepEqual(parseArrayString('[first, {a: [1,2]}, call(1,2), "a,b"]'),
    ['first', '{a: [1,2]}', 'call(1,2)', '"a,b"']);
assert.deepEqual(parseArrayString(String.raw`['a\'b,c', "x\\", [a,{b:(c,d)}]]`),
    [String.raw`'a\'b,c'`, String.raw`"x\\"`, '[a,{b:(c,d)}]']);

console.log('Tool list differences, prototype precedence/accessors and array-expression parsing passed.');

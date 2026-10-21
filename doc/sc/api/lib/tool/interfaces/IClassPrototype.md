[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IClassPrototype

# Interface: IClassPrototype

Defined in: [lib/tool.ts:62](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L62)

类原型信息

## Properties

### access

> **access**: `Record`\<`string`, \{ `get`: `any`; `set`: `any`; \}\>

Defined in: [lib/tool.ts:66](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L66)

访问器列表，key 为属性名，value 为包含 get 和 set 的对象，例如：{'prop1': { 'get': function() { ... }, 'set': function(v) { ... } }}

***

### method

> **method**: `Record`\<`string`, `any`\>

Defined in: [lib/tool.ts:64](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L64)

方法列表，key 为方法名，value 为函数体，例如：{'method1': function() { ... }}

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IClassPrototype

# Interface: IClassPrototype

Defined in: [dist/lib/tool.ts:84](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L84)

类原型信息

## Properties

### access

> **access**: `Record`\<`string`, \{ `get`: `any`; `set`: `any`; \}\>

Defined in: [dist/lib/tool.ts:88](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L88)

访问器列表，key 为属性名，value 为包含 get 和 set 的对象，例如：{'prop1': { 'get': function() { ... }, 'set': function(v) { ... } }}

***

### method

> **method**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/tool.ts:86](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L86)

方法列表，key 为方法名，value 为函数体，例如：{'method1': function() { ... }}

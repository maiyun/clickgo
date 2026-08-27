[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchProperty

# Function: watchProperty()

> **watchProperty**(`el`, `name`, `cb`, `immediate?`): `void`

Defined in: [lib/dom.ts:999](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L999)

监听一个对象的属性变化

## Parameters

### el

`HTMLElement`

对象

### name

`string` \| `string`[]

属性名

### cb

(`name`, `value`) => `void` \| `Promise`\<`void`\>

回调函数

### immediate?

`boolean` = `false`

是否立即执行一次

## Returns

`void`

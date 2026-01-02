[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchStyle

# Function: watchStyle()

> **watchStyle**(`el`, `name`, `cb`, `immediate`): `void`

Defined in: [dist/lib/dom.ts:755](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L755)

监听一个标签的计算后样式的变化

## Parameters

### el

`HTMLElement`

对象

### name

样式名

`string` | `string`[]

### cb

(`name`, `value`, `old`) => `void` \| `Promise`\<`void`\>

变更回调

### immediate

`boolean` = `false`

是否立刻执行一次

## Returns

`void`

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watch

# Function: watch()

> **watch**(`current`, `el`, `cb`, `mode`, `immediate`): `boolean`

Defined in: [dist/lib/dom.ts:543](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L543)

添加 DOM 内容变化监视

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务

### el

`HTMLElement`

dom 对象

### cb

(`mutations`) => `void` \| `Promise`\<`void`\>

回调

### mode

监听模式，默认 default

`"default"` | `"style"` | `"text"` | `"child"` | `"childsub"`

### immediate

`boolean` = `false`

## Returns

`boolean`

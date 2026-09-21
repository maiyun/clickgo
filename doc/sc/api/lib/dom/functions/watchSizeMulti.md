[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchSizeMulti

# Function: watchSizeMulti()

> **watchSizeMulti**(`current`, `el`, `cb`, `immediate?`): `boolean`

Defined in: [lib/dom.ts:772](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L772)

添加可与其他订阅者共存的 Element 大小监视

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前执行的任务

### el

`HTMLElement`

要监视的大小

### cb

() => `void` \| `Promise`\<`void`\>

回调函数

### immediate?

`boolean` = `false`

立刻先执行一次回调

## Returns

`boolean`

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / unwatchSizeMulti

# Function: unwatchSizeMulti()

> **unwatchSizeMulti**(`current`, `el`, `cb?`): `void`

Defined in: [lib/dom.ts:695](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L695)

移除当前任务的可共存 Element 大小监视

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前执行的任务

### el

`HTMLElement`

要移除监视的元素

### cb?

() => `void` \| `Promise`\<`void`\>

只移除此回调，留空则移除当前任务在本元素上的全部可共存回调

## Returns

`void`

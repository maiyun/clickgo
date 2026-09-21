[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchSize

# Function: watchSize()

> **watchSize**(`current`, `el`, `cb`, `immediate?`): `boolean`

Defined in: [lib/dom.ts:719](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L719)

添加监视 Element 对象大小，元素移除后自动停止监视，已经通过本方法监视的不会再次监视

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

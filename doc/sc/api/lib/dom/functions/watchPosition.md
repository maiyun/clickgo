[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / watchPosition

# Function: watchPosition()

> **watchPosition**(`el`, `cb`, `immediate`): `boolean`

Defined in: [dist/lib/dom.ts:258](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L258)

添加监视 Element 对象位置，元素移除后自动停止监视，已经监视中的不会再次监视，请短时间使用（虽然本方法也可以监听 element 的大小改变，但这是监听位置改变的副产品，如果仅仅监听大小改变请使用效率更高的 watch size）

## Parameters

### el

`HTMLElement`

要监视的大小

### cb

(`state`) => `void` \| `Promise`\<`void`\>

回调函数

### immediate

`boolean` = `false`

立刻先执行一次回调

## Returns

`boolean`

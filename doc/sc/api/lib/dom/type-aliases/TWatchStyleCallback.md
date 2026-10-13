[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / TWatchStyleCallback

# Type Alias: TWatchStyleCallback

> **TWatchStyleCallback** = (`name`, `value`, `old`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/dom.ts:1085](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1085)

样式变化通知回调

## Parameters

### name

`string`

CSS 属性名

### value

`string`

当前计算样式值

### old

`string`

上次记录的计算样式值

## Returns

`void` \| `Promise`\<`void`\>

无返回值，可异步完成

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / unwatchStyle

# Function: unwatchStyle()

> **unwatchStyle**(`el`, `name?`, `cb?`): `void`

Defined in: [lib/dom.ts:1219](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1219)

取消元素的样式监听，可只移除指定属性或指定回调

## Parameters

### el

`HTMLElement`

要取消监听的元素，移出页面后仍可取消

### name?

`string` \| `string`[]

样式名，留空则匹配全部属性

### cb?

`TWatchStyleCallback`

只移除此回调，留空则移除匹配属性的全部回调

## Returns

`void`

无返回值

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / findParentByData

# Function: findParentByData()

> **findParentByData**(`el`, `name`, `value?`): `HTMLElement` \| `null`

Defined in: [dist/lib/dom.ts:1263](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1263)

通过 data 名查找上层所有标签是否存在

## Parameters

### el

`HTMLElement`

当前标签

### name

`string`

要查找的 data 名

### value?

`string`

data 对应的值，留空则代表只要匹配了名就可以

## Returns

`HTMLElement` \| `null`

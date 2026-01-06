[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / layoutInsertAttr

# Function: layoutInsertAttr()

> **layoutInsertAttr**(`layout`, `insert`, `opt`): `string`

Defined in: [dist/lib/tool.ts:407](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L407)

给标签追加 attr，即使 attr 存在也会追加上一个新的（非真实 DOM 操作，仅仅是对字符串进行处理）

## Parameters

### layout

`string`

被追加

### insert

`string`

要追加

### opt

选项, ignore 忽略的标签，include 包含的标签

#### ignore?

`RegExp`[]

#### include?

`RegExp`[]

## Returns

`string`

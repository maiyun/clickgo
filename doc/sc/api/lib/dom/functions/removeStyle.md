[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / removeStyle

# Function: removeStyle()

> **removeStyle**(`taskId`, `type`, `formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:182](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L182)

移除 style 样式 dom

## Parameters

### taskId

`string`

要移除的任务 ID

### type

移除的类型

`"form"` | `"global"` | `"theme"` | `"control"`

### formId

`string` = `''`

要移除的窗体 ID

### panelId?

`string`

type 为 form 模式下若不指定则当前 form 包含 panel 的样式都会被移除

## Returns

`void`

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / pushStyle

# Function: pushStyle()

> **pushStyle**(`taskId`, `style`, `type`, `formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:158](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L158)

将 style 内容写入 dom

## Parameters

### taskId

`string`

当前任务 ID

### style

`string`

样式内容

### type

插入的类型

`"form"` | `"global"` | `"theme"` | `"control"`

### formId

`string` = `''`

当前窗体 ID（global 下可空，theme 下为主题唯一标识符，control 下为控件名）

### panelId?

`string`

若是 panel 中创建的则需要指定 panelId，仅 type 为 form 有效

## Returns

`void`

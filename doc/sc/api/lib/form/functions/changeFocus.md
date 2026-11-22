[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / changeFocus

# Function: changeFocus()

> **changeFocus**(`formId?`, `mode?`): `Promise`\<`void`\>

Defined in: [lib/form/window.ts:438](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/window.ts#L438)

将键盘焦点和任务焦点切换到目标窗体

## Parameters

### formId?

`string` = `''`

变更后的 form id

### mode?

`"restore"` \| `"activate"`

activate 主动激活并提到本层最前，restore 在现有可见窗体之间恢复焦点

## Returns

`Promise`\<`void`\>

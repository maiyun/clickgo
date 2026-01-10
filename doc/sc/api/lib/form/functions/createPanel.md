[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / createPanel

# Function: createPanel()

> **createPanel**\<`T`\>(`rootPanel`, `cls`, `opt`): `Promise`\<\{ `id`: `string`; `vapp`: [`IVApp`](../../core/interfaces/IVApp.md); `vroot`: `T`; \}\>

Defined in: [dist/lib/form.ts:2961](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2961)

创建 panel 对象，一般情况下无需使用

## Type Parameters

### T

`T` *extends* [`AbstractPanel`](../classes/AbstractPanel.md)

## Parameters

### rootPanel

[`AbstractControl`](../../control/classes/AbstractControl.md)

根 panel 控件

### cls

路径字符串或 AbstractPanel 类

`string` | () => `T`

### opt

选项

#### layout?

`string`

布局内容

#### path?

`string`

cls 为 string 时，path 参数才有效，为基准路径，如果不以 / 结尾则以最后一个 / 字符为准

#### style?

`string`

样式内容

## Returns

`Promise`\<\{ `id`: `string`; `vapp`: [`IVApp`](../../core/interfaces/IVApp.md); `vroot`: `T`; \}\>

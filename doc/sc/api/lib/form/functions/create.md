[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / create

# Function: create()

> **create**\<`T`\>(`current`, `cls`, `data?`, `opt?`): `Promise`\<`T`\>

Defined in: [dist/lib/form.ts:3337](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L3337)

创建一个窗体

## Type Parameters

### T

`T` *extends* [`AbstractForm`](../classes/AbstractForm.md)

## Parameters

### current

[`TCurrent`](../../core/type-aliases/TCurrent.md)

当前任务 ID

### cls

路径字符串或 AbstractForm 类

`string` | () => `T`

### data?

`Record`\<`string`, `any`\>

要传递的对象

### opt?

其他替换选项

#### layout?

`string`

#### path?

`string`

cls 为 string 时，path 参数才有效，为基准路径，如果不以 / 结尾则以最后一个 / 字符为准

#### style?

`string`

## Returns

`Promise`\<`T`\>

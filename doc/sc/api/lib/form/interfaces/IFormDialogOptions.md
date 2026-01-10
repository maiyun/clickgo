[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [dist/lib/form.ts:4155](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4155)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult**: `boolean`

Defined in: [dist/lib/form.ts:4159](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4159)

***

### buttons?

> `optional` **buttons**: `string`[]

Defined in: [dist/lib/form.ts:4158](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4158)

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4157](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4157)

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:4165](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4165)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction**: `"v"` \| `"h"`

Defined in: [dist/lib/form.ts:4161](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4161)

***

### gutter?

> `optional` **gutter**: `string` \| `number`

Defined in: [dist/lib/form.ts:4162](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4162)

***

### methods?

> `optional` **methods**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [dist/lib/form.ts:4167](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4167)

传值，需要用 methods.x 读取

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/form.ts:4171](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4171)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4178](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4178)

点击按钮触发事件

#### Parameters

##### this

[`AbstractForm`](../classes/AbstractForm.md) & `object`

##### e

[`IFormDialogSelectEvent`](IFormDialogSelectEvent.md)

数据事件

##### button

`string`

按钮的文本

#### Returns

`void`

***

### style?

> `optional` **style**: `string`

Defined in: [dist/lib/form.ts:4169](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4169)

样式表

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4156](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4156)

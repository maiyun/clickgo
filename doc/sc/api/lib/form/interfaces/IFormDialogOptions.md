[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [dist/lib/form.ts:4157](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4157)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult**: `boolean`

Defined in: [dist/lib/form.ts:4161](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4161)

***

### buttons?

> `optional` **buttons**: `string`[]

Defined in: [dist/lib/form.ts:4160](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4160)

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4159](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4159)

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:4167](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4167)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction**: `"v"` \| `"h"`

Defined in: [dist/lib/form.ts:4163](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4163)

***

### gutter?

> `optional` **gutter**: `string` \| `number`

Defined in: [dist/lib/form.ts:4164](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4164)

***

### methods?

> `optional` **methods**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [dist/lib/form.ts:4169](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4169)

传值，需要用 methods.x 读取

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/form.ts:4173](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4173)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4180](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4180)

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

Defined in: [dist/lib/form.ts:4171](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4171)

样式表

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4158](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4158)

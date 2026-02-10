[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [dist/lib/form.ts:4181](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4181)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult**: `boolean`

Defined in: [dist/lib/form.ts:4185](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4185)

***

### buttons?

> `optional` **buttons**: `string`[]

Defined in: [dist/lib/form.ts:4184](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4184)

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4183](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4183)

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:4191](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4191)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction**: `"v"` \| `"h"`

Defined in: [dist/lib/form.ts:4187](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4187)

***

### gutter?

> `optional` **gutter**: `string` \| `number`

Defined in: [dist/lib/form.ts:4188](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4188)

***

### methods?

> `optional` **methods**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [dist/lib/form.ts:4193](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4193)

传值，需要用 methods.x 读取

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/form.ts:4197](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4197)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4204](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4204)

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

Defined in: [dist/lib/form.ts:4195](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4195)

样式表

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4182](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4182)

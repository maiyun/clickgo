[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [dist/lib/form.ts:4163](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4163)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult**: `boolean`

Defined in: [dist/lib/form.ts:4167](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4167)

***

### buttons?

> `optional` **buttons**: `string`[]

Defined in: [dist/lib/form.ts:4166](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4166)

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4165](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4165)

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:4173](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4173)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction**: `"v"` \| `"h"`

Defined in: [dist/lib/form.ts:4169](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4169)

***

### gutter?

> `optional` **gutter**: `string` \| `number`

Defined in: [dist/lib/form.ts:4170](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4170)

***

### methods?

> `optional` **methods**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [dist/lib/form.ts:4175](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4175)

传值，需要用 methods.x 读取

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/form.ts:4179](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4179)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4186](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4186)

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

Defined in: [dist/lib/form.ts:4177](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4177)

样式表

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4164](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4164)

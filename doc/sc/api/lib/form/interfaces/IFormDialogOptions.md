[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [lib/form.ts:4239](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4239)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult**: `boolean`

Defined in: [lib/form.ts:4243](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4243)

***

### buttons?

> `optional` **buttons**: `string`[]

Defined in: [lib/form.ts:4242](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4242)

***

### content

> **content**: `string`

Defined in: [lib/form.ts:4241](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4241)

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:4249](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4249)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction**: `"v"` \| `"h"`

Defined in: [lib/form.ts:4245](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4245)

***

### gutter?

> `optional` **gutter**: `string` \| `number`

Defined in: [lib/form.ts:4246](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4246)

***

### methods?

> `optional` **methods**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [lib/form.ts:4251](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4251)

传值，需要用 methods.x 读取

***

### onMounted()?

> `optional` **onMounted**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:4271](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4271)

窗体挂载完成事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### path?

> `optional` **path**: `string`

Defined in: [lib/form.ts:4255](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4255)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form.ts:4262](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4262)

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

Defined in: [lib/form.ts:4253](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4253)

样式表

***

### title?

> `optional` **title**: `string`

Defined in: [lib/form.ts:4240](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4240)

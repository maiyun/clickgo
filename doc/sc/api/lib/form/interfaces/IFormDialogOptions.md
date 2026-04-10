[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [lib/form.ts:4253](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4253)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult?**: `boolean`

Defined in: [lib/form.ts:4257](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4257)

***

### buttons?

> `optional` **buttons?**: `string`[]

Defined in: [lib/form.ts:4256](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4256)

***

### content

> **content**: `string`

Defined in: [lib/form.ts:4255](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4255)

***

### data?

> `optional` **data?**: `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:4263](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4263)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction?**: `"v"` \| `"h"`

Defined in: [lib/form.ts:4259](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4259)

***

### gutter?

> `optional` **gutter?**: `string` \| `number`

Defined in: [lib/form.ts:4260](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4260)

***

### methods?

> `optional` **methods?**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [lib/form.ts:4265](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4265)

传值，需要用 methods.x 读取

***

### onMounted?

> `optional` **onMounted?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:4285](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4285)

窗体挂载完成事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/form.ts:4269](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4269)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form.ts:4276](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4276)

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

> `optional` **style?**: `string`

Defined in: [lib/form.ts:4267](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4267)

样式表

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form.ts:4254](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4254)

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptOptions

# Interface: IFormPromptOptions

Defined in: [dist/lib/form.ts:4225](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4225)

Prompt 选项

## Properties

### cancel?

> `optional` **cancel**: `boolean`

Defined in: [dist/lib/form.ts:4233](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4233)

是否显示取消按钮，默认显示

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4229](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4229)

内容说明

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4240](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4240)

点击按钮触发事件

#### Parameters

##### this

[`AbstractForm`](../classes/AbstractForm.md) & `object`

##### e

[`IFormPromptSelectEvent`](IFormPromptSelectEvent.md)

数据事件

##### button

`boolean`

true 代表确定，false 代表取消

#### Returns

`void`

***

### text?

> `optional` **text**: `string`

Defined in: [dist/lib/form.ts:4231](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4231)

文本默认值

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4227](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4227)

标题

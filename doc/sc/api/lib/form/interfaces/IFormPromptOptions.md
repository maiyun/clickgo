[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptOptions

# Interface: IFormPromptOptions

Defined in: [dist/lib/form.ts:4207](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4207)

Prompt 选项

## Properties

### cancel?

> `optional` **cancel**: `boolean`

Defined in: [dist/lib/form.ts:4215](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4215)

是否显示取消按钮，默认显示

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4211](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4211)

内容说明

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4222](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4222)

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

Defined in: [dist/lib/form.ts:4213](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4213)

文本默认值

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4209](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4209)

标题

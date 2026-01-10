[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptOptions

# Interface: IFormPromptOptions

Defined in: [dist/lib/form.ts:4199](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4199)

Prompt 选项

## Properties

### cancel?

> `optional` **cancel**: `boolean`

Defined in: [dist/lib/form.ts:4207](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4207)

是否显示取消按钮，默认显示

***

### content

> **content**: `string`

Defined in: [dist/lib/form.ts:4203](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4203)

内容说明

***

### select()?

> `optional` **select**: (`this`, `e`, `button`) => `void`

Defined in: [dist/lib/form.ts:4214](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4214)

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

Defined in: [dist/lib/form.ts:4205](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4205)

文本默认值

***

### title?

> `optional` **title**: `string`

Defined in: [dist/lib/form.ts:4201](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4201)

标题

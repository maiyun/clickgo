[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptOptions

# Interface: IFormPromptOptions

Defined in: [lib/form.ts:5012](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L5012)

Prompt 选项

## Properties

### cancel?

> `optional` **cancel?**: `boolean`

Defined in: [lib/form.ts:5020](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L5020)

是否显示取消按钮，默认显示

***

### content

> **content**: `string`

Defined in: [lib/form.ts:5016](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L5016)

内容说明

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form.ts:5027](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L5027)

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

> `optional` **text?**: `string`

Defined in: [lib/form.ts:5018](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L5018)

文本默认值

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form.ts:5014](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L5014)

标题

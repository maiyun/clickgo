[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptOptions

# Interface: IFormPromptOptions

Defined in: [lib/form.ts:4971](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4971)

Prompt 选项

## Properties

### cancel?

> `optional` **cancel?**: `boolean`

Defined in: [lib/form.ts:4979](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4979)

是否显示取消按钮，默认显示

***

### content

> **content**: `string`

Defined in: [lib/form.ts:4975](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4975)

内容说明

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form.ts:4986](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4986)

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

Defined in: [lib/form.ts:4977](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4977)

文本默认值

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form.ts:4973](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4973)

标题

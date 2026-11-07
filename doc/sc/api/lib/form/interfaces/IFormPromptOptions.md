[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptOptions

# Interface: IFormPromptOptions

Defined in: [lib/form/types.ts:174](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L174)

Prompt 选项

## Properties

### cancel?

> `optional` **cancel?**: `boolean`

Defined in: [lib/form/types.ts:182](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L182)

是否显示取消按钮，默认显示

***

### content

> **content**: `string`

Defined in: [lib/form/types.ts:178](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L178)

内容说明

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form/types.ts:189](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L189)

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

Defined in: [lib/form/types.ts:180](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L180)

文本默认值

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form/types.ts:176](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L176)

标题

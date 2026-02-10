[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IAbstractPanelQsChangeShowEvent

# Interface: IAbstractPanelQsChangeShowEvent

Defined in: [dist/lib/form.ts:4112](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4112)

AbstractPanel qsChange 显示事件

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/form.ts:4113](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4113)

#### action

> **action**: `"forword"` \| `"back"`

仅 nav 联动时有效，代表是前进还是回退

#### data

> **data**: `Record`\<`string`, `any`\>

#### nav

> **nav**: `boolean`

是否是 nav 模式

#### previous

> **previous**: `string`

仅 nav 联动时有效，代表上一个的 formHash 的值

#### qsChange

> **qsChange**: `boolean`

仅 nav 联动时有效，代表本次 qs 是否发生了变化

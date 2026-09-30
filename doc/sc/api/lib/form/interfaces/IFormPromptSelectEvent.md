[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptSelectEvent

# Interface: IFormPromptSelectEvent

Defined in: [lib/form.ts:4918](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4918)

Custom Event

## Extends

- [`ICustomEvent`](../../control/interfaces/ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/form.ts:4919](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4919)

#### button

> **button**: `boolean`

true 代表确定，false 代表取消

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:965](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L965)

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`go`](../../control/interfaces/ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:966](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L966)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`preventDefault`](../../control/interfaces/ICustomEvent.md#preventdefault)

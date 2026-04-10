[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptSelectEvent

# Interface: IFormPromptSelectEvent

Defined in: [lib/form.ts:4332](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4332)

Custom Event

## Extends

- [`ICustomEvent`](../../control/interfaces/ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/form.ts:4333](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4333)

#### button

> **button**: `boolean`

true 代表确定，false 代表取消

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:878](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L878)

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`go`](../../control/interfaces/ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:879](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L879)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`preventDefault`](../../control/interfaces/ICustomEvent.md#preventdefault)

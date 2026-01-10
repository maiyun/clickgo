[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptSelectEvent

# Interface: IFormPromptSelectEvent

Defined in: [dist/lib/form.ts:4221](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4221)

Custom Event

## Extends

- [`ICustomEvent`](../../control/interfaces/ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/form.ts:4222](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4222)

#### button

> **button**: `boolean`

true 代表确定，false 代表取消

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`go`](../../control/interfaces/ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`preventDefault`](../../control/interfaces/ICustomEvent.md#preventdefault)

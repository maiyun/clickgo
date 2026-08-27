[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormPromptSelectEvent

# Interface: IFormPromptSelectEvent

Defined in: [lib/form.ts:4362](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4362)

Custom Event

## Extends

- [`ICustomEvent`](../../control/interfaces/ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/form.ts:4363](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4363)

#### button

> **button**: `boolean`

true 代表确定，false 代表取消

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:931](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L931)

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`go`](../../control/interfaces/ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:932](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L932)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](../../control/interfaces/ICustomEvent.md).[`preventDefault`](../../control/interfaces/ICustomEvent.md#preventdefault)

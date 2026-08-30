[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectRemoveEvent

# Interface: ISelectRemoveEvent

Defined in: [lib/control.ts:1422](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1422)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1423](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1423)

#### index

> **index**: `number`

#### mode

> **mode**: `"list"` \| `"backspace"` \| `"tag"`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:945](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L945)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:946](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L946)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

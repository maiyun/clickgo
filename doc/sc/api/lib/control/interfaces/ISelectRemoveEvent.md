[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectRemoveEvent

# Interface: ISelectRemoveEvent

Defined in: [dist/lib/control.ts:1352](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1352)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1353)

#### index

> **index**: `number`

#### mode

> **mode**: `"list"` \| `"backspace"` \| `"tag"`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L875)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L876)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

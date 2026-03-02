[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectRemoveEvent

# Interface: ISelectRemoveEvent

Defined in: [lib/control.ts:1355](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1355)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1356](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1356)

#### index

> **index**: `number`

#### mode

> **mode**: `"list"` \| `"backspace"` \| `"tag"`

#### value

> **value**: `string`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:878](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L878)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:879](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L879)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

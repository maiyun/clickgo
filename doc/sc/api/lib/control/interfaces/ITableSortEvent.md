[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITableSortEvent

# Interface: ITableSortEvent

Defined in: [lib/control.ts:1561](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1561)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1562](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1562)

#### index

> **index**: `number`

#### label

> **label**: `string`

#### sort

> **sort**: `"desc"` \| `"asc"`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:965](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L965)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:966](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L966)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

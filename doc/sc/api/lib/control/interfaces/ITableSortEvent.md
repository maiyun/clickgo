[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITableSortEvent

# Interface: ITableSortEvent

Defined in: [dist/lib/control.ts:1436](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1436)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:1437](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1437)

#### index

> **index**: `number`

#### label

> **label**: `string`

#### sort

> **sort**: `"desc"` \| `"asc"`

***

### go

> **go**: `boolean`

Defined in: [dist/lib/control.ts:872](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L872)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault()

> **preventDefault**: () => `void`

Defined in: [dist/lib/control.ts:873](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L873)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

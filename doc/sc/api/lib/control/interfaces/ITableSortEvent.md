[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITableSortEvent

# Interface: ITableSortEvent

Defined in: [lib/control.ts:1506](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1506)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1507](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1507)

#### index

> **index**: `number`

#### label

> **label**: `string`

#### sort

> **sort**: `"desc"` \| `"asc"`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:931](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L931)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:932](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L932)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

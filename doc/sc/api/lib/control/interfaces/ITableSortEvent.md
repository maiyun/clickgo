[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITableSortEvent

# Interface: ITableSortEvent

Defined in: [lib/control.ts:1646](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1646)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1647](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1647)

#### index

> **index**: `number`

#### label

> **label**: `string`

#### sort

> **sort**: `"desc"` \| `"asc"`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:970](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L970)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:971](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L971)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

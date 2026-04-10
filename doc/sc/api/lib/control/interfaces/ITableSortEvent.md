[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ITableSortEvent

# Interface: ITableSortEvent

Defined in: [lib/control.ts:1444](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1444)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1445](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1445)

#### index

> **index**: `number`

#### label

> **label**: `string`

#### sort

> **sort**: `"desc"` \| `"asc"`

***

### go

> **go**: `boolean`

Defined in: [lib/control.ts:878](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L878)

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`go`](ICustomEvent.md#go)

***

### preventDefault

> **preventDefault**: () => `void`

Defined in: [lib/control.ts:879](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L879)

#### Returns

`void`

#### Inherited from

[`ICustomEvent`](ICustomEvent.md).[`preventDefault`](ICustomEvent.md#preventdefault)

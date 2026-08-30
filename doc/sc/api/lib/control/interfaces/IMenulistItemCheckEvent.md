[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IMenulistItemCheckEvent

# Interface: IMenulistItemCheckEvent

Defined in: [lib/control.ts:1001](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1001)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1002](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1002)

#### label?

> `optional` **label?**: `string`

radio 模式下，当前项的 label 内容

#### value

> **value**: `string` \| `boolean`

当前要选中的项

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

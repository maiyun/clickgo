[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IMenulistItemCheckEvent

# Interface: IMenulistItemCheckEvent

Defined in: [dist/lib/control.ts:929](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L929)

Custom Event

## Extends

- [`ICustomEvent`](ICustomEvent.md)

## Properties

### detail

> **detail**: `object`

Defined in: [dist/lib/control.ts:930](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L930)

#### label?

> `optional` **label**: `string`

radio 模式下，当前项的 label 内容

#### value

> **value**: `string` \| `boolean`

当前要选中的项

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

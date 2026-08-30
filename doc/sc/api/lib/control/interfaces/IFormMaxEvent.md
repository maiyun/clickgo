[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IFormMaxEvent

# Interface: IFormMaxEvent

Defined in: [lib/control.ts:1066](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1066)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1067](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1067)

#### action

> **action**: `"click"` \| `"move"`

#### event

> **event**: `MouseEvent` \| `TouchEvent` \| `null`

#### history

> **history**: \{ `height`: `number`; `left`: `number`; `top`: `number`; `width`: `number`; \} \| `null`

最大化之前的窗体位置

#### max

> **max**: `boolean`

当前是否时最大化状态

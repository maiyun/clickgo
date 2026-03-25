[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IFabricLayerlistchangeEvent

# Interface: IFabricLayerlistchangeEvent

Defined in: [lib/control.ts:1496](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1496)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1497](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1497)

#### names

> **names**: `string`[]

涉及的图层/文件夹 name 列表

#### type

> **type**: `"add"` \| `"move"` \| `"remove"` \| `"rename"` \| `"visible"` \| `"locked"`

变更类型：add 新增、remove 移除、rename 重命名、visible 可见性、locked 锁定状态、move 移动位置

#### value?

> `optional` **value**: `string` \| `boolean`

rename 时为新显示名称；visible 时为新可见状态（true 表示可见）；locked 时为新锁定状态

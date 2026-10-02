[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IDesktopItem

# Interface: IDesktopItem

Defined in: [lib/control.ts:1302](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1302)

桌面图标；位置和选择使用稳定 ID，不依赖数据顺序

## Properties

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/control.ts:1305](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1305)

***

### id

> **id**: `string`

Defined in: [lib/control.ts:1303](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1303)

***

### locked?

> `optional` **locked?**: `boolean`

Defined in: [lib/control.ts:1311](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1311)

禁止用户拖动；区域变化时仍可自动调整位置

***

### name

> **name**: `string`

Defined in: [lib/control.ts:1304](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1304)

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/control.ts:1307](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1307)

通用文件拖拽路径，由应用解释和执行操作

***

### type?

> `optional` **type?**: `0` \| `1`

Defined in: [lib/control.ts:1309](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1309)

0: 文件夹，1: 文件

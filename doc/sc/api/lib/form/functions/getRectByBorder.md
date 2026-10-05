[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / getRectByBorder

# Function: getRectByBorder()

> **getRectByBorder**(`border`, `area?`): `object`

Defined in: [lib/form.ts:2600](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L2600)

根据 border 方向 获取理论窗体大小

## Parameters

### border

[`TDomBorderCustom`](../../dom/type-aliases/TDomBorderCustom.md)

显示的位置代号

### area?

[`IAvailArea`](../../core/interfaces/IAvailArea.md) = `...`

布局区域，默认避开任务栏

## Returns

`object`

对应区域内的窗体矩形

### height

> **height**: `number`

### left

> **left**: `number`

### top

> **top**: `number`

### width

> **width**: `number`

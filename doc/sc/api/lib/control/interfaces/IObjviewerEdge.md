[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / IObjviewerEdge

# Interface: IObjviewerEdge

Defined in: [lib/control.ts:1741](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1741)

按稳定节点 ID 声明的连接，节点暂不存在时不绘制，不保存 DOM 引用

## Properties

### animation?

> `optional` **animation?**: `"none"` \| `"dash"` \| `"dots"`

Defined in: [lib/control.ts:1748](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1748)

默认 none，dash 为流动虚线，dots 为静止底线上的移动圆点

***

### direction?

> `optional` **direction?**: `"reverse"` \| `"forward"` \| `"both"`

Defined in: [lib/control.ts:1750](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1750)

默认 forward，沿 source 到 target；reverse 反向，both 双向

***

### dotCount?

> `optional` **dotCount?**: `number`

Defined in: [lib/control.ts:1754](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1754)

dots 模式每个方向的圆点数，默认 3，取整并限制为 1–8

***

### duration?

> `optional` **duration?**: `number`

Defined in: [lib/control.ts:1752](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1752)

动画周期，单位秒，默认 3，限制为 0.25–60；dots 为走完整条路径的时间

***

### label?

> `optional` **label?**: `string`

Defined in: [lib/control.ts:1744](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1744)

***

### source

> **source**: `string`

Defined in: [lib/control.ts:1742](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1742)

***

### status?

> `optional` **status?**: [`TObjviewerStatus`](../type-aliases/TObjviewerStatus.md)

Defined in: [lib/control.ts:1746](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1746)

默认 default，连接状态由应用明确提供

***

### target

> **target**: `string`

Defined in: [lib/control.ts:1743](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1743)

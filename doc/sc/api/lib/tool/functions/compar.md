[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / compar

# Function: compar()

> **compar**(`before`, `after`): `object`

Defined in: [dist/lib/tool.ts:1512](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1512)

- 对比老值和新值，看看新值中哪些移除了，哪些新增了

## Parameters

### before

(`string` \| `number`)[]

老值

### after

(`string` \| `number`)[]

新值

## Returns

`object`

### add

> **add**: `Record`\<`string`, `number`\>

### length

> **length**: `object`

#### length.add

> **add**: `number`

#### length.remove

> **remove**: `number`

### remove

> **remove**: `Record`\<`string`, `number`\>

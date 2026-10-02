[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / loadAssets

# Function: loadAssets()

> **loadAssets**(`urls`, `opt?`): `Promise`\<`boolean`\>

Defined in: [lib/tool.ts:2550](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2550)

批量并行加载 JS 和 CSS；JS 按列表顺序执行，CSS 按列表顺序插入

## Parameters

### urls

`string`[]

资源网址，忽略查询参数和哈希后以 .css 结尾的按 CSS 加载，其余按 JS 加载

### opt?

loaded 为单个资源加载完成回调，state 为 1-成功、0-失败

#### loaded?

(`url`, `state`) => `void`

## Returns

`Promise`\<`boolean`\>

全部资源成功返回 true，任一资源失败返回 false；空列表返回 true

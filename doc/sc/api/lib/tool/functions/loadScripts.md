[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / loadScripts

# Function: loadScripts()

> **loadScripts**(`urls`, `opt?`): `Promise`\<`void`\>

Defined in: [lib/tool.ts:2493](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2493)

批量加载 js 文件

## Parameters

### urls

`string`[]

js 文件列表

### opt?

选项

#### loaded?

(`url`, `state`) => `void`

#### ordered?

`boolean`

并行下载并按列表顺序执行，默认 false

## Returns

`Promise`\<`void`\>

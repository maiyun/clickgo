[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / setLocale

# Function: setLocale()

> **setLocale**(`taskId`, `lang`, `path`): `Promise`\<`boolean`\>

Defined in: [dist/lib/task.ts:1183](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1183)

加载全新 locale（老 locale 的所有语言的缓存会被卸载）

## Parameters

### taskId

[`TCurrent`](../../core/type-aliases/TCurrent.md)

要加载的任务 id

### lang

`string`

语言名，如 sc

### path

`string`

绝对或者相对 app 路径的地址

## Returns

`Promise`\<`boolean`\>

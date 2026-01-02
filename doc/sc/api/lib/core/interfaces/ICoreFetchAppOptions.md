[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ICoreFetchAppOptions

# Interface: ICoreFetchAppOptions

Defined in: [dist/lib/core.ts:1218](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1218)

现场下载 app 的参数

## Properties

### after?

> `optional` **after**: `string`

Defined in: [dist/lib/core.ts:1228](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1228)

网址后面附带的前缀，如 ?123

***

### notify?

> `optional` **notify**: `number` \| \{ `id?`: `number`; `loaded?`: `number`; `total?`: `number`; \}

Defined in: [dist/lib/core.ts:1219](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1219)

#### Type Declaration

`number`

\{ `id?`: `number`; `loaded?`: `number`; `total?`: `number`; \}

#### id?

> `optional` **id**: `number`

notify id

#### loaded?

> `optional` **loaded**: `number`

偏移基准

#### total?

> `optional` **total**: `number`

偏移总量

***

### progress()?

> `optional` **progress**: (`loaded`, `total`, `per`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1235](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1235)

下载进度

#### Parameters

##### loaded

`number`

已下载字节

##### total

`number`

总字节

##### per

`number`

含偏移进度百分比（0 - 1）

#### Returns

`void` \| `Promise`\<`void`\>

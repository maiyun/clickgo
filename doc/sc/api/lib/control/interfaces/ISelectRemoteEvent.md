[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / ISelectRemoteEvent

# Interface: ISelectRemoteEvent

Defined in: [lib/control.ts:1451](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1451)

## Properties

### detail

> **detail**: `object`

Defined in: [lib/control.ts:1452](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L1452)

#### callback

> **callback**: (`data?`) => `Promise`\<`void`\>

返回远程结果的一次性回调；过期搜索结果不会覆盖当前结果

##### Parameters

###### data?

`any`[] \| `Record`\<`string`, `string`\>

##### Returns

`Promise`\<`void`\>

#### value

> **value**: `string`

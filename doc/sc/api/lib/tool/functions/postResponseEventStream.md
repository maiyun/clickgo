[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / postResponseEventStream

# Function: postResponseEventStream()

> **postResponseEventStream**(`url`, `data`, `opts`): `AbortController`

Defined in: [dist/lib/tool.ts:1202](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1202)

发起 JSON 请求并获得文本 SSE 响应

## Parameters

### url

`string`

网址

### data

`Record`\<`string`, `any`\>

数据

### opts

选项

#### init?

`RequestInit`

#### onData?

(`chunk`) => `void` \| `Promise`\<`void`\>

来数据了

#### onEnd?

() => `void` \| `Promise`\<`void`\>

结束事件回调，主动结束、错误也会回调

#### onInit?

(`data`) => `void` \| `Promise`\<`void`\>

初始化回调（不一定会有）

#### onStart?

() => `void` \| `Promise`\<`void`\>

连接成功建立的回调

#### onTimeout?

() => `void` \| `Promise`\<`void`\>

连接失败（onStart 前调用）

## Returns

`AbortController`

返回可随时中止的控制器

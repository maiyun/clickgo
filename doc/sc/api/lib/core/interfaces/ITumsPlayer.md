[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ITumsPlayer

# Interface: ITumsPlayer

Defined in: [lib/core.ts:1701](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1701)

tums-player 模块对象

## Properties

### default

> **default**: `any`

Defined in: [lib/core.ts:1702](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1702)

***

### startTalk

> **startTalk**: (`opt`) => `Promise`\<`void`\>

Defined in: [lib/core.ts:1704](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1704)

开始对讲

#### Parameters

##### opt

###### mode?

`"half_duplex"` \| `"vad"` \| `"aec"`

half_duplex-半双工模式,vad-VAD 人声检测模式,aec-AEC 全双工模式，默认 vad

###### sid

`string`

###### skey

`string`

###### url

`string`

#### Returns

`Promise`\<`void`\>

***

### stopTalk

> **stopTalk**: () => `void`

Defined in: [lib/core.ts:1712](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1712)

停止对讲

#### Returns

`void`

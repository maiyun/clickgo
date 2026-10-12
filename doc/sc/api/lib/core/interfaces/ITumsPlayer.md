[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ITumsPlayer

# Interface: ITumsPlayer

Defined in: [lib/core.ts:1909](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1909)

tums-player 模块对象

## Properties

### default

> **default**: `any`

Defined in: [lib/core.ts:1910](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1910)

***

### startTalk

> **startTalk**: (`opt`) => `Promise`\<`void`\>

Defined in: [lib/core.ts:1912](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1912)

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

Defined in: [lib/core.ts:1920](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1920)

停止对讲

#### Returns

`void`

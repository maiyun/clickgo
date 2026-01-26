[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ITumsPlayer

# Interface: ITumsPlayer

Defined in: [dist/lib/core.ts:1381](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1381)

tums-player 模块对象

## Properties

### default

> **default**: `any`

Defined in: [dist/lib/core.ts:1382](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1382)

***

### startTalk()

> **startTalk**: (`opt`) => `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1384](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1384)

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

### stopTalk()

> **stopTalk**: () => `void`

Defined in: [dist/lib/core.ts:1392](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1392)

停止对讲

#### Returns

`void`

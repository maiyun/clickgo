[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ITumsPlayer

# Interface: ITumsPlayer

Defined in: [lib/core.ts:1394](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1394)

tums-player 模块对象

## Properties

### default

> **default**: `any`

Defined in: [lib/core.ts:1395](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1395)

***

### startTalk()

> **startTalk**: (`opt`) => `Promise`\<`void`\>

Defined in: [lib/core.ts:1397](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1397)

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

Defined in: [lib/core.ts:1405](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1405)

停止对讲

#### Returns

`void`

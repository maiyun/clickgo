[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ITumsPlayer

# Interface: ITumsPlayer

Defined in: [lib/core.ts:1695](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1695)

tums-player 模块对象

## Properties

### default

> **default**: `any`

Defined in: [lib/core.ts:1696](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1696)

***

### startTalk

> **startTalk**: (`opt`) => `Promise`\<`void`\>

Defined in: [lib/core.ts:1698](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1698)

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

Defined in: [lib/core.ts:1706](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1706)

停止对讲

#### Returns

`void`

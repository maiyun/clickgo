[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / ITumsPlayer

# Interface: ITumsPlayer

Defined in: [dist/lib/core.ts:1367](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1367)

tums-player 模块对象

## Properties

### default

> **default**: `any`

Defined in: [dist/lib/core.ts:1368](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1368)

***

### startTalk()

> **startTalk**: (`opt`) => `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:1370](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1370)

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

Defined in: [dist/lib/core.ts:1378](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1378)

停止对讲

#### Returns

`void`

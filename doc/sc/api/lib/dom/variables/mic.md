[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / mic

# Variable: mic

> `const` **mic**: `object`

Defined in: [dist/lib/dom.ts:1612](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L1612)

麦克风通过 WebSocket 对讲

## Type Declaration

### start()

> **start**: (`ws`, `opts`) => `Promise`\<`boolean`\>

开始对讲

#### Parameters

##### ws

`string`

ws:// wss://

##### opts

选项

###### onProcess?

(`data`) => `void` \| `Promise`\<`void`\>

rms 音量回调

###### onStart?

() => `void` \| `Promise`\<`void`\>

开始事件回调，此时说话才会被发送

###### onStop?

() => `void` \| `Promise`\<`void`\>

结束事件回调，主动结束也会回调

###### onVoiceEnd?

() => `void` \| `Promise`\<`void`\>

有人声结束

###### onVoiceStart?

() => `void` \| `Promise`\<`void`\>

有人声开始

###### rtn?

`boolean`

需要初次 message 认证返回 { "result": 1 } 后才开始对讲，默认为 true

#### Returns

`Promise`\<`boolean`\>

### stop()

> **stop**: () => `void`

结束对讲

#### Returns

`void`

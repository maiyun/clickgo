[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / stateMachine

# Function: stateMachine()

> **stateMachine**(`code`, `start`, `process`): `void`

Defined in: [lib/tool.ts:628](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L628)

源码分段状态机，单词按 ASCII 字母、数字、_ 和 $ 识别

## Parameters

### code

`string`

待扫描源码，CRLF 和 CR 统一为 LF

### start

`number`

归一化后的起始 UTF-16 索引

### process

(`event`) => `boolean`

片段回调，true 继续、false 停止；位置含首尾，bracket 是共享计数对象

## Returns

`void`

无返回值

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / INativeLaunchEvent

# Interface: INativeLaunchEvent

Defined in: [lib/native/events.ts:5](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/events.ts#L5)

普通 GUI 启动请求；CLI/stdio 由 Native 单独处理，不投递此事件

## Properties

### args

> **args**: `string`[]

Defined in: [lib/native/events.ts:10](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/events.ts#L10)

去掉可执行文件和开发入口后的业务参数，保留顺序

***

### cwd

> **cwd**: `string`

Defined in: [lib/native/events.ts:12](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/events.ts#L12)

原生绝对工作目录，参数中的相对路径以此为基准

***

### requestId

> **requestId**: `number`

Defined in: [lib/native/events.ts:7](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/events.ts#L7)

本进程内请求 ID；同一次启动的文件事件使用相同 ID

***

### source

> **source**: `"startup"` \| `"second-instance"`

Defined in: [lib/native/events.ts:8](https://github.com/maiyun/clickgo/blob/master/dist/lib/native/events.ts#L8)

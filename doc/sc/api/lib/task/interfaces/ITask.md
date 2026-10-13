[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITask

# Interface: ITask

Defined in: [lib/task.ts:2045](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2045)

运行中的任务对象

## Properties

### app

> **app**: [`IApp`](../../core/interfaces/IApp.md)

Defined in: [lib/task.ts:2051](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2051)

***

### appId?

> `readonly` `optional` **appId?**: `string`

Defined in: [lib/task.ts:2050](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2050)

启动时确定的固定 App ID，与运行实例 ID 和加载路径无关

***

### class

> **class**: [`AbstractApp`](../../core/classes/AbstractApp.md)

Defined in: [lib/task.ts:2052](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2052)

***

### controls

> **controls**: `Record`\<`string`, \{ `access`: `Record`\<`string`, `any`\>; `computed`: `Record`\<`string`, `any`\>; `config`: [`IControlConfig`](../../control/interfaces/IControlConfig.md); `data`: `Record`\<`string`, `any`\>; `emits`: `Record`\<`string`, `any`\>; `files`: `Record`\<`string`, `Blob` \| `string`\>; `layout`: `string`; `methods`: `Record`\<`string`, `any`\>; `props`: `Record`\<`string`, `any`\>; \}\>

Defined in: [lib/task.ts:2066](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2066)

已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用

***

### current

> **current**: `string`

Defined in: [lib/task.ts:2061](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2061)

当前 app 运行路径，末尾不含 /

***

### customTheme

> **customTheme**: `boolean`

Defined in: [lib/task.ts:2053](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2053)

***

### ending?

> `optional` **ending?**: `boolean`

Defined in: [lib/task.ts:2047](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2047)

已开始退出；框架释放异步资源期间拒绝新命令

***

### forms

> **forms**: `Record`\<`string`, [`IForm`](../../form/interfaces/IForm.md)\>

Defined in: [lib/task.ts:2064](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2064)

窗体对象列表

***

### id

> **id**: `string`

Defined in: [lib/task.ts:2048](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2048)

***

### locale

> **locale**: `object`

Defined in: [lib/task.ts:2054](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2054)

#### data

> **data**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### lang

> **lang**: `string`

***

### path

> **path**: `string`

Defined in: [lib/task.ts:2059](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2059)

当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 /

***

### threads

> **threads**: `Record`\<`string`, [`IThread`](IThread.md)\>

Defined in: [lib/task.ts:2083](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2083)

文件名 -> thread 控制对象

***

### timers

> **timers**: `Record`\<`string`, `string`\>

Defined in: [lib/task.ts:2081](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2081)

任务中的 timer 列表

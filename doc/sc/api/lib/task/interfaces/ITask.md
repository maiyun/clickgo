[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITask

# Interface: ITask

Defined in: [lib/task.ts:2038](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2038)

运行中的任务对象

## Properties

### app

> **app**: [`IApp`](../../core/interfaces/IApp.md)

Defined in: [lib/task.ts:2040](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2040)

***

### class

> **class**: [`AbstractApp`](../../core/classes/AbstractApp.md)

Defined in: [lib/task.ts:2041](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2041)

***

### controls

> **controls**: `Record`\<`string`, \{ `access`: `Record`\<`string`, `any`\>; `computed`: `Record`\<`string`, `any`\>; `config`: [`IControlConfig`](../../control/interfaces/IControlConfig.md); `data`: `Record`\<`string`, `any`\>; `emits`: `Record`\<`string`, `any`\>; `files`: `Record`\<`string`, `Blob` \| `string`\>; `layout`: `string`; `methods`: `Record`\<`string`, `any`\>; `props`: `Record`\<`string`, `any`\>; \}\>

Defined in: [lib/task.ts:2055](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2055)

已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用

***

### current

> **current**: `string`

Defined in: [lib/task.ts:2050](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2050)

当前 app 运行路径，末尾不含 /

***

### customTheme

> **customTheme**: `boolean`

Defined in: [lib/task.ts:2042](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2042)

***

### forms

> **forms**: `Record`\<`string`, [`IForm`](../../form/interfaces/IForm.md)\>

Defined in: [lib/task.ts:2053](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2053)

窗体对象列表

***

### id

> **id**: `string`

Defined in: [lib/task.ts:2039](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2039)

***

### locale

> **locale**: `object`

Defined in: [lib/task.ts:2043](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2043)

#### data

> **data**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### lang

> **lang**: `string`

***

### path

> **path**: `string`

Defined in: [lib/task.ts:2048](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2048)

当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 /

***

### threads

> **threads**: `Record`\<`string`, [`IThread`](IThread.md)\>

Defined in: [lib/task.ts:2072](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2072)

文件名 -> thread 控制对象

***

### timers

> **timers**: `Record`\<`string`, `string`\>

Defined in: [lib/task.ts:2070](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2070)

任务中的 timer 列表

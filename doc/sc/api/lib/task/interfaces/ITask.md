[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITask

# Interface: ITask

Defined in: [lib/task.ts:1792](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1792)

运行中的任务对象

## Properties

### app

> **app**: [`IApp`](../../core/interfaces/IApp.md)

Defined in: [lib/task.ts:1794](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1794)

***

### class

> **class**: [`AbstractApp`](../../core/classes/AbstractApp.md)

Defined in: [lib/task.ts:1795](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1795)

***

### controls

> **controls**: `Record`\<`string`, \{ `access`: `Record`\<`string`, `any`\>; `computed`: `Record`\<`string`, `any`\>; `config`: [`IControlConfig`](../../control/interfaces/IControlConfig.md); `data`: `Record`\<`string`, `any`\>; `emits`: `Record`\<`string`, `any`\>; `files`: `Record`\<`string`, `Blob` \| `string`\>; `layout`: `string`; `methods`: `Record`\<`string`, `any`\>; `props`: `Record`\<`string`, `any`\>; \}\>

Defined in: [lib/task.ts:1809](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1809)

已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用

***

### current

> **current**: `string`

Defined in: [lib/task.ts:1804](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1804)

当前 app 运行路径，末尾不含 /

***

### customTheme

> **customTheme**: `boolean`

Defined in: [lib/task.ts:1796](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1796)

***

### forms

> **forms**: `Record`\<`string`, [`IForm`](../../form/interfaces/IForm.md)\>

Defined in: [lib/task.ts:1807](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1807)

窗体对象列表

***

### id

> **id**: `string`

Defined in: [lib/task.ts:1793](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1793)

***

### locale

> **locale**: `object`

Defined in: [lib/task.ts:1797](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1797)

#### data

> **data**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### lang

> **lang**: `string`

***

### path

> **path**: `string`

Defined in: [lib/task.ts:1802](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1802)

当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 /

***

### threads

> **threads**: `Record`\<`string`, [`IThread`](IThread.md)\>

Defined in: [lib/task.ts:1826](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1826)

文件名 -> thread 控制对象

***

### timers

> **timers**: `Record`\<`string`, `string`\>

Defined in: [lib/task.ts:1824](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1824)

任务中的 timer 列表

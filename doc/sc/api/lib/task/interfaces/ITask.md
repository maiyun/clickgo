[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITask

# Interface: ITask

Defined in: [lib/task.ts:1697](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1697)

运行中的任务对象

## Properties

### app

> **app**: [`IApp`](../../core/interfaces/IApp.md)

Defined in: [lib/task.ts:1699](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1699)

***

### class

> **class**: [`AbstractApp`](../../core/classes/AbstractApp.md)

Defined in: [lib/task.ts:1700](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1700)

***

### controls

> **controls**: `Record`\<`string`, \{ `access`: `Record`\<`string`, `any`\>; `computed`: `Record`\<`string`, `any`\>; `config`: [`IControlConfig`](../../control/interfaces/IControlConfig.md); `data`: `Record`\<`string`, `any`\>; `emits`: `Record`\<`string`, `any`\>; `files`: `Record`\<`string`, `Blob` \| `string`\>; `layout`: `string`; `methods`: `Record`\<`string`, `any`\>; `props`: `Record`\<`string`, `any`\>; \}\>

Defined in: [lib/task.ts:1714](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1714)

已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用

***

### current

> **current**: `string`

Defined in: [lib/task.ts:1709](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1709)

当前 app 运行路径，末尾不含 /

***

### customTheme

> **customTheme**: `boolean`

Defined in: [lib/task.ts:1701](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1701)

***

### forms

> **forms**: `Record`\<`string`, [`IForm`](../../form/interfaces/IForm.md)\>

Defined in: [lib/task.ts:1712](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1712)

窗体对象列表

***

### id

> **id**: `string`

Defined in: [lib/task.ts:1698](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1698)

***

### locale

> **locale**: `object`

Defined in: [lib/task.ts:1702](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1702)

#### data

> **data**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### lang

> **lang**: `string`

***

### path

> **path**: `string`

Defined in: [lib/task.ts:1707](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1707)

当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 /

***

### threads

> **threads**: `Record`\<`string`, [`IThread`](IThread.md)\>

Defined in: [lib/task.ts:1731](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1731)

文件名 -> thread 控制对象

***

### timers

> **timers**: `Record`\<`string`, `string`\>

Defined in: [lib/task.ts:1729](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1729)

任务中的 timer 列表

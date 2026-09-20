[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITask

# Interface: ITask

Defined in: [lib/task.ts:1734](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1734)

运行中的任务对象

## Properties

### app

> **app**: [`IApp`](../../core/interfaces/IApp.md)

Defined in: [lib/task.ts:1736](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1736)

***

### class

> **class**: [`AbstractApp`](../../core/classes/AbstractApp.md)

Defined in: [lib/task.ts:1737](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1737)

***

### controls

> **controls**: `Record`\<`string`, \{ `access`: `Record`\<`string`, `any`\>; `computed`: `Record`\<`string`, `any`\>; `config`: [`IControlConfig`](../../control/interfaces/IControlConfig.md); `data`: `Record`\<`string`, `any`\>; `emits`: `Record`\<`string`, `any`\>; `files`: `Record`\<`string`, `Blob` \| `string`\>; `layout`: `string`; `methods`: `Record`\<`string`, `any`\>; `props`: `Record`\<`string`, `any`\>; \}\>

Defined in: [lib/task.ts:1751](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1751)

已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用

***

### current

> **current**: `string`

Defined in: [lib/task.ts:1746](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1746)

当前 app 运行路径，末尾不含 /

***

### customTheme

> **customTheme**: `boolean`

Defined in: [lib/task.ts:1738](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1738)

***

### forms

> **forms**: `Record`\<`string`, [`IForm`](../../form/interfaces/IForm.md)\>

Defined in: [lib/task.ts:1749](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1749)

窗体对象列表

***

### id

> **id**: `string`

Defined in: [lib/task.ts:1735](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1735)

***

### locale

> **locale**: `object`

Defined in: [lib/task.ts:1739](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1739)

#### data

> **data**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### lang

> **lang**: `string`

***

### path

> **path**: `string`

Defined in: [lib/task.ts:1744](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1744)

当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 /

***

### threads

> **threads**: `Record`\<`string`, [`IThread`](IThread.md)\>

Defined in: [lib/task.ts:1768](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1768)

文件名 -> thread 控制对象

***

### timers

> **timers**: `Record`\<`string`, `string`\>

Defined in: [lib/task.ts:1766](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1766)

任务中的 timer 列表

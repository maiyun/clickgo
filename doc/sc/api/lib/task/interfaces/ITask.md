[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITask

# Interface: ITask

Defined in: [lib/task.ts:2055](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2055)

运行中的任务对象

## Properties

### app

> **app**: [`IApp`](../../core/interfaces/IApp.md)

Defined in: [lib/task.ts:2061](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2061)

***

### appId?

> `readonly` `optional` **appId?**: `string`

Defined in: [lib/task.ts:2060](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2060)

启动时确定的固定 App ID，与运行实例 ID 和加载路径无关

***

### class

> **class**: [`AbstractApp`](../../core/classes/AbstractApp.md)

Defined in: [lib/task.ts:2062](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2062)

***

### controls

> **controls**: `Record`\<`string`, \{ `access`: `Record`\<`string`, `any`\>; `computed`: `Record`\<`string`, `any`\>; `config`: [`IControlConfig`](../../control/interfaces/IControlConfig.md); `data`: `Record`\<`string`, `any`\>; `emits`: `Record`\<`string`, `any`\>; `files`: `Record`\<`string`, `Blob` \| `string`\>; `layout`: `string`; `methods`: `Record`\<`string`, `any`\>; `props`: `Record`\<`string`, `any`\>; \}\>

Defined in: [lib/task.ts:2076](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2076)

已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用

***

### current

> **current**: `string`

Defined in: [lib/task.ts:2071](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2071)

当前 app 运行路径，末尾不含 /

***

### customTheme

> **customTheme**: `boolean`

Defined in: [lib/task.ts:2063](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2063)

***

### ending?

> `optional` **ending?**: `boolean`

Defined in: [lib/task.ts:2057](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2057)

已开始退出；框架释放异步资源期间拒绝新命令

***

### forms

> **forms**: `Record`\<`string`, [`IForm`](../../form/interfaces/IForm.md)\>

Defined in: [lib/task.ts:2074](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2074)

窗体对象列表

***

### id

> **id**: `string`

Defined in: [lib/task.ts:2058](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2058)

***

### locale

> **locale**: `object`

Defined in: [lib/task.ts:2064](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2064)

#### data

> **data**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

#### lang

> **lang**: `string`

***

### path

> **path**: `string`

Defined in: [lib/task.ts:2069](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2069)

当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 /

***

### threads

> **threads**: `Record`\<`string`, [`IThread`](IThread.md)\>

Defined in: [lib/task.ts:2093](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2093)

文件名 -> thread 控制对象

***

### timers

> **timers**: `Record`\<`string`, `string`\>

Defined in: [lib/task.ts:2091](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2091)

任务中的 timer 列表

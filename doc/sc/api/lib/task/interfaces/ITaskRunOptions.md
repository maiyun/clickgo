[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITaskRunOptions

# Interface: ITaskRunOptions

Defined in: [lib/task.ts:2090](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2090)

## Properties

### after?

> `optional` **after?**: `string`

Defined in: [lib/task.ts:2103](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2103)

如果是网络加载 cga，则网址后面会附带，如 ?123

***

### data?

> `optional` **data?**: `Record`\<`string`, `any`\>

Defined in: [lib/task.ts:2105](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2105)

给 task 传值

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/task.ts:2091](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2091)

***

### initProgress?

> `optional` **initProgress?**: (`loaded`, `total`, `type`, `msg`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:2093](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2093)

初始化进度回调

#### Parameters

##### loaded

`number`

##### total

`number`

##### type

[`EIPTYPE`](../enumerations/EIPTYPE.md)

##### msg

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### notify?

> `optional` **notify?**: `boolean`

Defined in: [lib/task.ts:2099](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2099)

显示 notify 窗口

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/task.ts:2107](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2107)

执行文件的基路径，一般在传入 APP 包时使用，以 .cga 结尾

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/task.ts:2101](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2101)

直接赋予此任务相应权限，有 "root" 权限的应用才能设置

***

### perProgress?

> `optional` **perProgress?**: (`per`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:2097](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2097)

返回总加载进度百分比（0 - 1）

#### Parameters

##### per

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### progress?

> `optional` **progress?**: (`loaded`, `total`, `type`, `path`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:2095](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2095)

加载进度回调（根据 type 分为不同阶段）

#### Parameters

##### loaded

`number`

##### total

`number`

##### type

`"control"` \| `"app"`

##### path

`string`

#### Returns

`void` \| `Promise`\<`void`\>

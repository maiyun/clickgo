[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITaskRunOptions

# Interface: ITaskRunOptions

Defined in: [dist/lib/task.ts:1740](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1740)

## Properties

### after?

> `optional` **after**: `string`

Defined in: [dist/lib/task.ts:1753](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1753)

如果是网络加载 cga，则网址后面会附带，如 ?123

***

### data?

> `optional` **data**: `Record`\<`string`, `any`\>

Defined in: [dist/lib/task.ts:1755](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1755)

给 task 传值

***

### icon?

> `optional` **icon**: `string`

Defined in: [dist/lib/task.ts:1741](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1741)

***

### initProgress()?

> `optional` **initProgress**: (`loaded`, `total`, `type`, `msg`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1743](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1743)

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

> `optional` **notify**: `boolean`

Defined in: [dist/lib/task.ts:1749](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1749)

显示 notify 窗口

***

### path?

> `optional` **path**: `string`

Defined in: [dist/lib/task.ts:1757](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1757)

执行文件的基路径，一般在传入 APP 包时使用，以 .cga 结尾

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [dist/lib/task.ts:1751](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1751)

直接赋予此任务相应权限，有 "root" 权限的应用才能设置

***

### perProgress()?

> `optional` **perProgress**: (`per`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1747](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1747)

返回总加载进度百分比（0 - 1）

#### Parameters

##### per

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### progress()?

> `optional` **progress**: (`loaded`, `total`, `type`, `path`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1745](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1745)

加载进度回调（根据 type 分为不同阶段）

#### Parameters

##### loaded

`number`

##### total

`number`

##### type

`"control"` | `"app"`

##### path

`string`

#### Returns

`void` \| `Promise`\<`void`\>

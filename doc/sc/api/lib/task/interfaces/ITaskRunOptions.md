[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / ITaskRunOptions

# Interface: ITaskRunOptions

Defined in: [lib/task.ts:2107](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2107)

## Properties

### after?

> `optional` **after?**: `string`

Defined in: [lib/task.ts:2120](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2120)

如果是网络加载 cga，则网址后面会附带，如 ?123

***

### data?

> `optional` **data?**: `Record`\<`string`, `any`\>

Defined in: [lib/task.ts:2122](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2122)

给 task 传值

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/task.ts:2108](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2108)

***

### initProgress?

> `optional` **initProgress?**: (`loaded`, `total`, `type`, `msg`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:2110](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2110)

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

Defined in: [lib/task.ts:2116](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2116)

显示 notify 窗口

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/task.ts:2124](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2124)

执行文件的基路径，一般在传入 APP 包时使用，以 .cga 结尾

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/task.ts:2118](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2118)

直接赋予此任务相应权限，有 "root" 权限的应用才能设置

***

### perProgress?

> `optional` **perProgress?**: (`per`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:2114](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2114)

返回总加载进度百分比（0 - 1）

#### Parameters

##### per

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### progress?

> `optional` **progress?**: (`loaded`, `total`, `type`, `path`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:2112](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2112)

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

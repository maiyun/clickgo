[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:1688](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1688)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:1696](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1696)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:1692](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1692)

移除事件

#### Parameters

##### name

`"message"`

##### handler

(`e`) => `any`

#### Returns

`void`

***

### on

> **on**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:1690](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1690)

绑定事件

#### Parameters

##### name

`"message"`

##### handler

(`e`) => `any`

#### Returns

`void`

***

### send

> **send**: (`data`) => `void`

Defined in: [lib/task.ts:1694](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1694)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

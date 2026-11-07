[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:2039](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2039)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:2047](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2047)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:2043](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2043)

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

Defined in: [lib/task.ts:2041](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2041)

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

Defined in: [lib/task.ts:2045](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2045)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

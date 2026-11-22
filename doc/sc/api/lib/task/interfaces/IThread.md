[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:2040](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2040)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:2048](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2048)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:2044](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2044)

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

Defined in: [lib/task.ts:2042](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2042)

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

Defined in: [lib/task.ts:2046](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2046)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

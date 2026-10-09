[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:2030](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2030)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:2038](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2038)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:2034](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2034)

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

Defined in: [lib/task.ts:2032](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2032)

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

Defined in: [lib/task.ts:2036](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2036)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

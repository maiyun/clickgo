[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:1726](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1726)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:1734](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1734)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:1730](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1730)

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

Defined in: [lib/task.ts:1728](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1728)

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

Defined in: [lib/task.ts:1732](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1732)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

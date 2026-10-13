[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:2033](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2033)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:2041](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2041)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:2037](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2037)

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

Defined in: [lib/task.ts:2035](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2035)

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

Defined in: [lib/task.ts:2039](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L2039)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

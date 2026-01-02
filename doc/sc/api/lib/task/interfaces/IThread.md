[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [dist/lib/task.ts:1678](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1678)

## Properties

### end()

> **end**: () => `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1686](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1686)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off()

> **off**: (`name`, `handler`) => `void`

Defined in: [dist/lib/task.ts:1682](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1682)

移除事件

#### Parameters

##### name

`"message"`

##### handler

(`e`) => `any`

#### Returns

`void`

***

### on()

> **on**: (`name`, `handler`) => `void`

Defined in: [dist/lib/task.ts:1680](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1680)

绑定事件

#### Parameters

##### name

`"message"`

##### handler

(`e`) => `any`

#### Returns

`void`

***

### send()

> **send**: (`data`) => `void`

Defined in: [dist/lib/task.ts:1684](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1684)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

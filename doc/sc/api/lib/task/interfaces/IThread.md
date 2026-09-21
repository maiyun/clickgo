[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:1780](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1780)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:1788](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1788)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:1784](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1784)

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

Defined in: [lib/task.ts:1782](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1782)

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

Defined in: [lib/task.ts:1786](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1786)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

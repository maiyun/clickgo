[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / IThread

# Interface: IThread

Defined in: [lib/task.ts:1685](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1685)

## Properties

### end

> **end**: () => `Promise`\<`void`\>

Defined in: [lib/task.ts:1693](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1693)

结束线程

#### Returns

`Promise`\<`void`\>

***

### off

> **off**: (`name`, `handler`) => `void`

Defined in: [lib/task.ts:1689](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1689)

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

Defined in: [lib/task.ts:1687](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1687)

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

Defined in: [lib/task.ts:1691](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1691)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

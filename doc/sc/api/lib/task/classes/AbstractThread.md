[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1514](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1514)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1523](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1523)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1517](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1517)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1552](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1552)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1526](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1526)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1535](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1535)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1541](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1541)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1529](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1529)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1547](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1547)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

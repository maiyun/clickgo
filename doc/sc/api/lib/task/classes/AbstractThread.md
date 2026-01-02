[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [dist/lib/task.ts:1513](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1513)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [dist/lib/task.ts:1522](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1522)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [dist/lib/task.ts:1516](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1516)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [dist/lib/task.ts:1551](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1551)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1525](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1525)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1534](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1534)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1540](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1540)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/task.ts:1528](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1528)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [dist/lib/task.ts:1546](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1546)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

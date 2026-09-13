[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1561](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1561)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1570](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1570)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1564](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1564)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1599](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1599)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1573](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1573)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1582](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1582)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1588](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1588)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1576](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1576)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1594](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1594)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

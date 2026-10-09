[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1865](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1865)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1874](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1874)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1868](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1868)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1903](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1903)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1877](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1877)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1886](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1886)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1892](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1892)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1880](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1880)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1898](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1898)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

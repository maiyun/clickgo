[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1876](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1876)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1885](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1885)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1879](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1879)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1914](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1914)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1888](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1888)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1897](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1897)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1903](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1903)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1891](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1891)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1909](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1909)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

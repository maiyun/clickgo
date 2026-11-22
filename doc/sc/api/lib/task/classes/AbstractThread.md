[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1873](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1873)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1882](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1882)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1876](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1876)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1911](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1911)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1885](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1885)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1894](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1894)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1900](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1900)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1888](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1888)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1906](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1906)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

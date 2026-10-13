[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1868](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1868)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1877](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1877)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1871](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1871)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1906](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1906)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1880](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1880)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1889](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1889)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1895](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1895)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1883](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1883)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1901](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1901)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

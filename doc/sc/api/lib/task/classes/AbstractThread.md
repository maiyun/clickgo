[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1557](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1557)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1566](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1566)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1560](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1560)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1595](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1595)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1569](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1569)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1578](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1578)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1584](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1584)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1572](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1572)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1590](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1590)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

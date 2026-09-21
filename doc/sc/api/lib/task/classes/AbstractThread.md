[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/task](../index.md) / AbstractThread

# Abstract Class: AbstractThread

Defined in: [lib/task.ts:1615](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1615)

线程抽象类

## Constructors

### Constructor

> **new AbstractThread**(): `AbstractThread`

#### Returns

`AbstractThread`

## Properties

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/task.ts:1624](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1624)

系统会自动设置本项

## Accessors

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/task.ts:1618](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1618)

当前文件在包内的路径

##### Returns

`string`

## Methods

### close()

> **close**(): `void`

Defined in: [lib/task.ts:1653](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1653)

关闭线程

#### Returns

`void`

***

### main()

> `abstract` **main**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1627](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1627)

线程入口

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onEnded()

> **onEnded**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1636](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1636)

线程结束事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1642](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1642)

报错

#### Parameters

##### e

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMessage()

> **onMessage**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/task.ts:1630](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1630)

线程接收事件

#### Parameters

##### e

`MessageEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### send()

> **send**(`data`): `void`

Defined in: [lib/task.ts:1648](https://github.com/maiyun/clickgo/blob/master/dist/lib/task.ts#L1648)

发送数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

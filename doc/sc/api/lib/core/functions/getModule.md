[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / getModule

# Function: getModule()

获取模块内容，通常用于异步加载模块时使用

## Param

模块名

## Call Signature

> **getModule**(`name`): `Promise`\<[`IMonacoLoader`](../interfaces/IMonacoLoader.md) \| `null`\>

Defined in: [lib/core.ts:1324](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1324)

### Parameters

#### name

`"monaco-editor"`

### Returns

`Promise`\<[`IMonacoLoader`](../interfaces/IMonacoLoader.md) \| `null`\>

## Call Signature

> **getModule**(`name`): `Promise`\<[`ITumsPlayer`](../interfaces/ITumsPlayer.md) \| `null`\>

Defined in: [lib/core.ts:1325](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1325)

### Parameters

#### name

`"tums-player"`

### Returns

`Promise`\<[`ITumsPlayer`](../interfaces/ITumsPlayer.md) \| `null`\>

## Call Signature

> **getModule**(`name`): `Promise`\<\{ \} \| `null`\>

Defined in: [lib/core.ts:1326](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1326)

### Parameters

#### name

`"mpegts"`

### Returns

`Promise`\<\{ \} \| `null`\>

## Call Signature

> **getModule**(`name`): `Promise`\<`__module` \| `null`\>

Defined in: [lib/core.ts:1327](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1327)

### Parameters

#### name

`"fabric"`

### Returns

`Promise`\<`__module` \| `null`\>

## Call Signature

> **getModule**(`name`): `Promise`\<`any`\>

Defined in: [lib/core.ts:1328](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1328)

### Parameters

#### name

`string`

### Returns

`Promise`\<`any`\>

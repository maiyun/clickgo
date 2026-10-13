[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppPackage

# Interface: IAppPackage

Defined in: [lib/core.ts:1477](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1477)

CGA 按需解密包读取器

## Methods

### clear()

> **clear**(): `void`

Defined in: [lib/core.ts:1481](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1481)

#### Returns

`void`

***

### getContent()

> **getContent**(`path`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [lib/core.ts:1478](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1478)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string` \| `Blob` \| `null`\>

***

### readDir()

> **readDir**(`path`): [`IAppPackageEntry`](IAppPackageEntry.md)[]

Defined in: [lib/core.ts:1480](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1480)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageEntry`](IAppPackageEntry.md)[]

***

### stats()

> **stats**(`path`): [`IAppPackageStats`](IAppPackageStats.md) \| `null`

Defined in: [lib/core.ts:1479](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1479)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageStats`](IAppPackageStats.md) \| `null`

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppPackage

# Interface: IAppPackage

Defined in: [lib/core.ts:1700](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1700)

CGA 按需解密包读取器

## Methods

### clear()

> **clear**(): `void`

Defined in: [lib/core.ts:1704](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1704)

#### Returns

`void`

***

### getContent()

> **getContent**(`path`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [lib/core.ts:1701](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1701)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string` \| `Blob` \| `null`\>

***

### readDir()

> **readDir**(`path`): [`IAppPackageEntry`](IAppPackageEntry.md)[]

Defined in: [lib/core.ts:1703](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1703)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageEntry`](IAppPackageEntry.md)[]

***

### stats()

> **stats**(`path`): [`IAppPackageStats`](IAppPackageStats.md) \| `null`

Defined in: [lib/core.ts:1702](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1702)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageStats`](IAppPackageStats.md) \| `null`

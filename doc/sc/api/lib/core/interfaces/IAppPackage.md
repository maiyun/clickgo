[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppPackage

# Interface: IAppPackage

Defined in: [lib/core.ts:1734](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1734)

CGA 按需解密包读取器

## Methods

### clear()

> **clear**(): `void`

Defined in: [lib/core.ts:1738](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1738)

#### Returns

`void`

***

### getContent()

> **getContent**(`path`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [lib/core.ts:1735](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1735)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string` \| `Blob` \| `null`\>

***

### readDir()

> **readDir**(`path`): [`IAppPackageEntry`](IAppPackageEntry.md)[]

Defined in: [lib/core.ts:1737](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1737)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageEntry`](IAppPackageEntry.md)[]

***

### stats()

> **stats**(`path`): [`IAppPackageStats`](IAppPackageStats.md) \| `null`

Defined in: [lib/core.ts:1736](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1736)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageStats`](IAppPackageStats.md) \| `null`

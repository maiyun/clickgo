[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppPackage

# Interface: IAppPackage

Defined in: [lib/core.ts:1589](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1589)

CGA 按需解密包读取器

## Methods

### clear()

> **clear**(): `void`

Defined in: [lib/core.ts:1593](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1593)

#### Returns

`void`

***

### getContent()

> **getContent**(`path`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [lib/core.ts:1590](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1590)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string` \| `Blob` \| `null`\>

***

### readDir()

> **readDir**(`path`): [`IAppPackageEntry`](IAppPackageEntry.md)[]

Defined in: [lib/core.ts:1592](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1592)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageEntry`](IAppPackageEntry.md)[]

***

### stats()

> **stats**(`path`): [`IAppPackageStats`](IAppPackageStats.md) \| `null`

Defined in: [lib/core.ts:1591](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1591)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageStats`](IAppPackageStats.md) \| `null`

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppPackage

# Interface: IAppPackage

Defined in: [lib/core.ts:1570](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1570)

CGA 按需解密包读取器

## Methods

### clear()

> **clear**(): `void`

Defined in: [lib/core.ts:1574](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1574)

#### Returns

`void`

***

### getContent()

> **getContent**(`path`): `Promise`\<`string` \| `Blob` \| `null`\>

Defined in: [lib/core.ts:1571](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1571)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`string` \| `Blob` \| `null`\>

***

### readDir()

> **readDir**(`path`): [`IAppPackageEntry`](IAppPackageEntry.md)[]

Defined in: [lib/core.ts:1573](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1573)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageEntry`](IAppPackageEntry.md)[]

***

### stats()

> **stats**(`path`): [`IAppPackageStats`](IAppPackageStats.md) \| `null`

Defined in: [lib/core.ts:1572](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1572)

#### Parameters

##### path

`string`

#### Returns

[`IAppPackageStats`](IAppPackageStats.md) \| `null`

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / IMountHandler

# Interface: IMountHandler

Defined in: [dist/lib/fs.ts:1406](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1406)

## Properties

### chmod()?

> `optional` **chmod**: (`path`, `mod`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1426](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1426)

#### Parameters

##### path

`string`

##### mod

`string` | `number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### copyFile()?

> `optional` **copyFile**: (`src`, `dest`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1429](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1429)

#### Parameters

##### src

`string`

##### dest

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### date?

> `optional` **date**: `Date`

Defined in: [dist/lib/fs.ts:1408](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1408)

挂载时间，无需设置

***

### getContent()?

> `optional` **getContent**: (`path`, `options?`) => `string` \| `Blob` \| `Promise`\<`string` \| `Blob` \| `null`\> \| `null`

Defined in: [dist/lib/fs.ts:1409](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1409)

#### Parameters

##### path

`string`

##### options?

`BufferEncoding` | \{ `encoding?`: BufferEncoding \| undefined; `end?`: `number`; `progress?`: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>; `start?`: `number`; \}

#### Returns

`string` \| `Blob` \| `Promise`\<`string` \| `Blob` \| `null`\> \| `null`

***

### mkdir()?

> `optional` **mkdir**: (`path`, `mode?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1424](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1424)

#### Parameters

##### path

`string`

##### mode?

`number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### putContent()?

> `optional` **putContent**: (`path`, `data`, `options?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1415](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1415)

#### Parameters

##### path

`string`

##### data

`string` | `Blob`

##### options?

###### encoding?

`BufferEncoding` \| `null`

###### flag?

`string` \| `number`

###### mode?

`string` \| `number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### readDir()?

> `optional` **readDir**: (`path`, `encoding?`) => [`IDirent`](IDirent.md)[] \| `Promise`\<[`IDirent`](IDirent.md)[]\>

Defined in: [dist/lib/fs.ts:1428](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1428)

#### Parameters

##### path

`string`

##### encoding?

`BufferEncoding`

#### Returns

[`IDirent`](IDirent.md)[] \| `Promise`\<[`IDirent`](IDirent.md)[]\>

***

### readLink()?

> `optional` **readLink**: (`path`, `encoding?`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [dist/lib/fs.ts:1420](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1420)

#### Parameters

##### path

`string`

##### encoding?

`BufferEncoding`

#### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### rename()?

> `optional` **rename**: (`oldPath`, `newPath`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1427](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1427)

#### Parameters

##### oldPath

`string`

##### newPath

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### rmdir()?

> `optional` **rmdir**: (`path`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1425](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1425)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### stats()?

> `optional` **stats**: (`path`) => [`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

Defined in: [dist/lib/fs.ts:1423](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1423)

#### Parameters

##### path

`string`

#### Returns

[`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

***

### symlink()?

> `optional` **symlink**: (`filePath`, `linkPath`, `type?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1421](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1421)

#### Parameters

##### filePath

`string`

##### linkPath

`string`

##### type?

`"dir"` | `"file"` | `"junction"`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### unlink()?

> `optional` **unlink**: (`path`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [dist/lib/fs.ts:1422](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1422)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

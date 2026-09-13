[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / IMountHandler

# Interface: IMountHandler

Defined in: [lib/fs.ts:1334](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1334)

## Properties

### chmod?

> `optional` **chmod?**: (`path`, `mod`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1354](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1354)

#### Parameters

##### path

`string`

##### mod

`string` \| `number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### copyFile?

> `optional` **copyFile?**: (`src`, `dest`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1357](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1357)

#### Parameters

##### src

`string`

##### dest

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### date?

> `optional` **date?**: `Date`

Defined in: [lib/fs.ts:1336](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1336)

挂载时间，无需设置

***

### getContent?

> `optional` **getContent?**: (`path`, `options?`) => `string` \| `Blob` \| `Promise`\<`string` \| `Blob` \| `null`\> \| `null`

Defined in: [lib/fs.ts:1337](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1337)

#### Parameters

##### path

`string`

##### options?

`BufferEncoding` \| \{ `encoding?`: BufferEncoding \| undefined; `end?`: `number`; `progress?`: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>; `start?`: `number`; \}

#### Returns

`string` \| `Blob` \| `Promise`\<`string` \| `Blob` \| `null`\> \| `null`

***

### mkdir?

> `optional` **mkdir?**: (`path`, `mode?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1352](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1352)

#### Parameters

##### path

`string`

##### mode?

`number`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### putContent?

> `optional` **putContent?**: (`path`, `data`, `options?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1343](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1343)

#### Parameters

##### path

`string`

##### data

`string` \| `Blob`

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

### readDir?

> `optional` **readDir?**: (`path`, `encoding?`) => [`IDirent`](IDirent.md)[] \| `Promise`\<[`IDirent`](IDirent.md)[]\>

Defined in: [lib/fs.ts:1356](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1356)

#### Parameters

##### path

`string`

##### encoding?

`BufferEncoding`

#### Returns

[`IDirent`](IDirent.md)[] \| `Promise`\<[`IDirent`](IDirent.md)[]\>

***

### readLink?

> `optional` **readLink?**: (`path`, `encoding?`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [lib/fs.ts:1348](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1348)

#### Parameters

##### path

`string`

##### encoding?

`BufferEncoding`

#### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### rename?

> `optional` **rename?**: (`oldPath`, `newPath`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1355](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1355)

#### Parameters

##### oldPath

`string`

##### newPath

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### rmdir?

> `optional` **rmdir?**: (`path`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1353](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1353)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### stats?

> `optional` **stats?**: (`path`) => [`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

Defined in: [lib/fs.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1351)

#### Parameters

##### path

`string`

#### Returns

[`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

***

### symlink?

> `optional` **symlink?**: (`filePath`, `linkPath`, `type?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1349](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1349)

#### Parameters

##### filePath

`string`

##### linkPath

`string`

##### type?

`"dir"` \| `"file"` \| `"junction"`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### unlink?

> `optional` **unlink?**: (`path`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1350](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1350)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

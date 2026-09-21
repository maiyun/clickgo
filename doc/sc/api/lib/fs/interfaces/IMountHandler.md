[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/fs](../index.md) / IMountHandler

# Interface: IMountHandler

Defined in: [lib/fs.ts:1346](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1346)

## Properties

### chmod?

> `optional` **chmod?**: (`path`, `mod`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1366](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1366)

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

Defined in: [lib/fs.ts:1369](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1369)

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

Defined in: [lib/fs.ts:1348](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1348)

挂载时间，无需设置

***

### getContent?

> `optional` **getContent?**: (`path`, `options?`) => `string` \| `Blob` \| `Promise`\<`string` \| `Blob` \| `null`\> \| `null`

Defined in: [lib/fs.ts:1349](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1349)

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

Defined in: [lib/fs.ts:1364](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1364)

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

Defined in: [lib/fs.ts:1355](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1355)

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

Defined in: [lib/fs.ts:1368](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1368)

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

Defined in: [lib/fs.ts:1360](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1360)

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

Defined in: [lib/fs.ts:1367](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1367)

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

Defined in: [lib/fs.ts:1365](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1365)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### stats?

> `optional` **stats?**: (`path`) => [`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

Defined in: [lib/fs.ts:1363](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1363)

#### Parameters

##### path

`string`

#### Returns

[`IStats`](IStats.md) \| `Promise`\<[`IStats`](IStats.md) \| `null`\> \| `null`

***

### symlink?

> `optional` **symlink?**: (`filePath`, `linkPath`, `type?`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [lib/fs.ts:1361](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1361)

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

Defined in: [lib/fs.ts:1362](https://github.com/maiyun/clickgo/blob/master/dist/lib/fs.ts#L1362)

#### Parameters

##### path

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

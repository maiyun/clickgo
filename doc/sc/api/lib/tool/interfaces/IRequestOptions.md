[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [lib/tool.ts:848](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L848)

请求选项

## Properties

### body?

> `optional` **body?**: `FormData`

Defined in: [lib/tool.ts:851](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L851)

***

### credentials?

> `optional` **credentials?**: `boolean`

Defined in: [lib/tool.ts:849](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L849)

***

### end?

> `optional` **end?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:860](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L860)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error?

> `optional` **error?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:863](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L863)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [lib/tool.ts:854](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L854)

***

### load?

> `optional` **load?**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:862](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L862)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"`

Defined in: [lib/tool.ts:850](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L850)

***

### progress?

> `optional` **progress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:861](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L861)

#### Parameters

##### loaded

`number`

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### responseType?

> `optional` **responseType?**: `XMLHttpRequestResponseType`

Defined in: [lib/tool.ts:853](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L853)

***

### start?

> `optional` **start?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:859](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L859)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/tool.ts:852](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L852)

***

### uploadEnd?

> `optional` **uploadEnd?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:858](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L858)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress?

> `optional` **uploadProgress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:857](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L857)

#### Parameters

##### loaded

`number`

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadStart?

> `optional` **uploadStart?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:856](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L856)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

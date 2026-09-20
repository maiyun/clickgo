[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [lib/tool.ts:2648](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2648)

请求选项

## Properties

### body?

> `optional` **body?**: `FormData`

Defined in: [lib/tool.ts:2651](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2651)

***

### credentials?

> `optional` **credentials?**: `boolean`

Defined in: [lib/tool.ts:2649](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2649)

***

### end?

> `optional` **end?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2660](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2660)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error?

> `optional` **error?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2663](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2663)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [lib/tool.ts:2654](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2654)

***

### load?

> `optional` **load?**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2662](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2662)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"`

Defined in: [lib/tool.ts:2650](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2650)

***

### progress?

> `optional` **progress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2661](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2661)

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

Defined in: [lib/tool.ts:2653](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2653)

***

### start?

> `optional` **start?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2659](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2659)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/tool.ts:2652](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2652)

***

### uploadEnd?

> `optional` **uploadEnd?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2658](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2658)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress?

> `optional` **uploadProgress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2657](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2657)

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

Defined in: [lib/tool.ts:2656](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2656)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

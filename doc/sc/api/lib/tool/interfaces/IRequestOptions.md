[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [lib/tool.ts:2638](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2638)

请求选项

## Properties

### body?

> `optional` **body?**: `FormData`

Defined in: [lib/tool.ts:2641](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2641)

***

### credentials?

> `optional` **credentials?**: `boolean`

Defined in: [lib/tool.ts:2639](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2639)

***

### end?

> `optional` **end?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2650](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2650)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error?

> `optional` **error?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2653](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2653)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [lib/tool.ts:2644](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2644)

***

### load?

> `optional` **load?**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2652](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2652)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"`

Defined in: [lib/tool.ts:2640](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2640)

***

### progress?

> `optional` **progress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2651](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2651)

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

Defined in: [lib/tool.ts:2643](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2643)

***

### start?

> `optional` **start?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2649](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2649)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/tool.ts:2642](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2642)

***

### uploadEnd?

> `optional` **uploadEnd?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2648](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2648)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress?

> `optional` **uploadProgress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2647](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2647)

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

Defined in: [lib/tool.ts:2646](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2646)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

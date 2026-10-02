[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [lib/tool.ts:2734](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2734)

请求选项

## Properties

### body?

> `optional` **body?**: `FormData`

Defined in: [lib/tool.ts:2737](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2737)

***

### credentials?

> `optional` **credentials?**: `boolean`

Defined in: [lib/tool.ts:2735](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2735)

***

### end?

> `optional` **end?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2746](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2746)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error?

> `optional` **error?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2749](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2749)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [lib/tool.ts:2740](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2740)

***

### load?

> `optional` **load?**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2748](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2748)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"`

Defined in: [lib/tool.ts:2736](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2736)

***

### progress?

> `optional` **progress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2747](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2747)

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

Defined in: [lib/tool.ts:2739](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2739)

***

### start?

> `optional` **start?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2745](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2745)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/tool.ts:2738](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2738)

***

### uploadEnd?

> `optional` **uploadEnd?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2744](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2744)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress?

> `optional` **uploadProgress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2743](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2743)

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

Defined in: [lib/tool.ts:2742](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2742)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

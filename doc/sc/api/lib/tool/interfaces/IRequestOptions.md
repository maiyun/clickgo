[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [lib/tool.ts:2618](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2618)

请求选项

## Properties

### body?

> `optional` **body?**: `FormData`

Defined in: [lib/tool.ts:2621](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2621)

***

### credentials?

> `optional` **credentials?**: `boolean`

Defined in: [lib/tool.ts:2619](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2619)

***

### end?

> `optional` **end?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2630](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2630)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error?

> `optional` **error?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2633](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2633)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [lib/tool.ts:2624](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2624)

***

### load?

> `optional` **load?**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2632](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2632)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"`

Defined in: [lib/tool.ts:2620](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2620)

***

### progress?

> `optional` **progress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2631](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2631)

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

Defined in: [lib/tool.ts:2623](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2623)

***

### start?

> `optional` **start?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2629](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2629)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/tool.ts:2622](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2622)

***

### uploadEnd?

> `optional` **uploadEnd?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2628](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2628)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress?

> `optional` **uploadProgress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2627](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2627)

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

Defined in: [lib/tool.ts:2626](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2626)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

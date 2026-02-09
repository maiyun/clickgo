[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [dist/lib/tool.ts:2613](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2613)

请求选项

## Properties

### body?

> `optional` **body**: `FormData`

Defined in: [dist/lib/tool.ts:2616](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2616)

***

### credentials?

> `optional` **credentials**: `boolean`

Defined in: [dist/lib/tool.ts:2614](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2614)

***

### end()?

> `optional` **end**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2625](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2625)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error()?

> `optional` **error**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2628](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2628)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers**: `HeadersInit`

Defined in: [dist/lib/tool.ts:2619](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2619)

***

### load()?

> `optional` **load**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2627](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2627)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method**: `"GET"` \| `"POST"`

Defined in: [dist/lib/tool.ts:2615](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2615)

***

### progress()?

> `optional` **progress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2626](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2626)

#### Parameters

##### loaded

`number`

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### responseType?

> `optional` **responseType**: `XMLHttpRequestResponseType`

Defined in: [dist/lib/tool.ts:2618](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2618)

***

### start()?

> `optional` **start**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2624](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2624)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [dist/lib/tool.ts:2617](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2617)

***

### uploadEnd()?

> `optional` **uploadEnd**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2623](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2623)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress()?

> `optional` **uploadProgress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2622](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2622)

#### Parameters

##### loaded

`number`

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadStart()?

> `optional` **uploadStart**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2621](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2621)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

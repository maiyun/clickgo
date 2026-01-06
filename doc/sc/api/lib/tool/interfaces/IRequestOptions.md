[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [dist/lib/tool.ts:2627](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2627)

请求选项

## Properties

### body?

> `optional` **body**: `FormData`

Defined in: [dist/lib/tool.ts:2630](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2630)

***

### credentials?

> `optional` **credentials**: `boolean`

Defined in: [dist/lib/tool.ts:2628](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2628)

***

### end()?

> `optional` **end**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2639](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2639)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error()?

> `optional` **error**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2642](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2642)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers**: `HeadersInit`

Defined in: [dist/lib/tool.ts:2633](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2633)

***

### load()?

> `optional` **load**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2641](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2641)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method**: `"GET"` \| `"POST"`

Defined in: [dist/lib/tool.ts:2629](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2629)

***

### progress()?

> `optional` **progress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2640](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2640)

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

Defined in: [dist/lib/tool.ts:2632](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2632)

***

### start()?

> `optional` **start**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2638](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2638)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [dist/lib/tool.ts:2631](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2631)

***

### uploadEnd()?

> `optional` **uploadEnd**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2637](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2637)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress()?

> `optional` **uploadProgress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2636](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2636)

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

Defined in: [dist/lib/tool.ts:2635](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2635)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [dist/lib/tool.ts:2633](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2633)

请求选项

## Properties

### body?

> `optional` **body**: `FormData`

Defined in: [dist/lib/tool.ts:2636](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2636)

***

### credentials?

> `optional` **credentials**: `boolean`

Defined in: [dist/lib/tool.ts:2634](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2634)

***

### end()?

> `optional` **end**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2645](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2645)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error()?

> `optional` **error**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2648](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2648)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers**: `HeadersInit`

Defined in: [dist/lib/tool.ts:2639](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2639)

***

### load()?

> `optional` **load**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2647](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2647)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method**: `"GET"` \| `"POST"`

Defined in: [dist/lib/tool.ts:2635](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2635)

***

### progress()?

> `optional` **progress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2646](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2646)

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

Defined in: [dist/lib/tool.ts:2638](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2638)

***

### start()?

> `optional` **start**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2644](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2644)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [dist/lib/tool.ts:2637](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2637)

***

### uploadEnd()?

> `optional` **uploadEnd**: () => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2643](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2643)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress()?

> `optional` **uploadProgress**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/tool.ts:2642](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2642)

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

Defined in: [dist/lib/tool.ts:2641](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2641)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

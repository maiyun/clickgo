[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [lib/tool.ts:2690](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2690)

请求选项

## Properties

### body?

> `optional` **body?**: `FormData`

Defined in: [lib/tool.ts:2693](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2693)

***

### credentials?

> `optional` **credentials?**: `boolean`

Defined in: [lib/tool.ts:2691](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2691)

***

### end?

> `optional` **end?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2702](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2702)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error?

> `optional` **error?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2705](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2705)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [lib/tool.ts:2696](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2696)

***

### load?

> `optional` **load?**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2704](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2704)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"`

Defined in: [lib/tool.ts:2692](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2692)

***

### progress?

> `optional` **progress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2703](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2703)

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

Defined in: [lib/tool.ts:2695](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2695)

***

### start?

> `optional` **start?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2701](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2701)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/tool.ts:2694](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2694)

***

### uploadEnd?

> `optional` **uploadEnd?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2700](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2700)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress?

> `optional` **uploadProgress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:2699](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2699)

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

Defined in: [lib/tool.ts:2698](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2698)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

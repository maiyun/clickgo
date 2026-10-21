[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / IRequestOptions

# Interface: IRequestOptions

Defined in: [lib/tool.ts:865](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L865)

请求选项

## Properties

### body?

> `optional` **body?**: `FormData`

Defined in: [lib/tool.ts:868](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L868)

***

### credentials?

> `optional` **credentials?**: `boolean`

Defined in: [lib/tool.ts:866](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L866)

***

### end?

> `optional` **end?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:877](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L877)

#### Returns

`void` \| `Promise`\<`void`\>

***

### error?

> `optional` **error?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:880](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L880)

#### Returns

`void` \| `Promise`\<`void`\>

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [lib/tool.ts:871](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L871)

***

### load?

> `optional` **load?**: (`res`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:879](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L879)

#### Parameters

##### res

`any`

#### Returns

`void` \| `Promise`\<`void`\>

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"`

Defined in: [lib/tool.ts:867](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L867)

***

### progress?

> `optional` **progress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:878](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L878)

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

Defined in: [lib/tool.ts:870](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L870)

***

### start?

> `optional` **start?**: (`total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:876](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L876)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/tool.ts:869](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L869)

***

### uploadEnd?

> `optional` **uploadEnd?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L875)

#### Returns

`void` \| `Promise`\<`void`\>

***

### uploadProgress?

> `optional` **uploadProgress?**: (`loaded`, `total`) => `void` \| `Promise`\<`void`\>

Defined in: [lib/tool.ts:874](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L874)

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

Defined in: [lib/tool.ts:873](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L873)

#### Parameters

##### total

`number`

#### Returns

`void` \| `Promise`\<`void`\>

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / lang

# Variable: lang

> `const` **lang**: `object`

Defined in: [dist/lib/tool.ts:2560](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L2560)

语言相关

## Type Declaration

### codes

> **codes**: `string`[]

语言代号

### getCodeByAccept()

> **getCodeByAccept**: (`accept?`) => `string`

根据常用语言字符串获取语言 code

#### Parameters

##### accept?

`string`

常用字符串，如 zh-cn，或包含 zh-cn 的字符串，默认取浏览器的语言

#### Returns

`string`

### map

> **map**: `Record`\<`string`, `string`\>

浏览器常用映射为本语言

### names

> **names**: `string`[]

语言名称

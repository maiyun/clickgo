[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/native](../index.md) / open

# Function: open()

> **open**(`options`): `Promise`\<`string`[] \| `null`\>

Defined in: [dist/lib/native.ts:316](https://github.com/maiyun/clickgo/blob/master/dist/lib/native.ts#L316)

弹出文件选择框

## Parameters

### options

选项

#### filters?

`object`[]

筛选的文件类型

#### path?

`string`

默认路径，不含 /storage/，如 /d/

#### props?

\{ `directory?`: `boolean`; `file?`: `boolean`; `multi?`: `boolean`; \}

#### props.directory?

`boolean`

允许选择文件夹，默认 false

#### props.file?

`boolean`

允许选择文件，默认 true

#### props.multi?

`boolean`

允许多选，默认 false

## Returns

`Promise`\<`string`[] \| `null`\>

选择的文件路径列表，不含 /storage/

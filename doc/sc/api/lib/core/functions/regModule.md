[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / regModule

# Function: regModule()

> **regModule**(`current`, `name`, `opt`): `Promise`\<`boolean`\>

Defined in: [dist/lib/core.ts:1015](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1015)

注册模块

## Parameters

### current

[`TCurrent`](../type-aliases/TCurrent.md)

当前任务 id

### name

`string`

模块名

### opt

选项

#### func?

() => `any`

除 ESM 模式外必填

#### version?

`string`

ESM 模式必填

## Returns

`Promise`\<`boolean`\>

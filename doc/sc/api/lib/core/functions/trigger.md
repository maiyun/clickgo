[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / trigger

# Function: trigger()

> **trigger**(`name`, `taskId`, `formId`, `param1`, `param2`, `param3`): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:266](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L266)

主动触发系统级事件，用 this.trigger 替代

## Parameters

### name

[`TGlobalEvent`](../type-aliases/TGlobalEvent.md)

### taskId

`string` | `boolean` | `KeyboardEvent`

### formId

`string` | `boolean` | `Record`\<`string`, `any`\> | `null`

### param1

`string` | `boolean` | `Error`

### param2

`string` | `Record`\<`string`, `any`\>

### param3

`boolean` = `true`

## Returns

`Promise`\<`void`\>

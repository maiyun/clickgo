[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / formatTime

# Function: formatTime()

> **formatTime**(`ts`, `tz?`): `object`

Defined in: [lib/tool.ts:1599](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L1599)

将日期对象或毫秒级时间戳转换为字符串

## Parameters

### ts

`number` \| `Date`

时间戳或日期对象

### tz?

`number`

传入要显示的时区，小时，如 8，默认以当前客户端时区为准

## Returns

`object`

### date

> **date**: `string`

### time

> **time**: `string`

### zone

> **zone**: `string`

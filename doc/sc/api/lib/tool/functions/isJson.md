[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/tool](../index.md) / isJson

# Function: isJson()

> **isJson**(`value`): `value is TJson`

Defined in: [lib/tool.ts:705](https://github.com/maiyun/clickgo/blob/master/dist/lib/tool.ts#L705)

判断 JS 值是否符合 JSON 数据约束；字符串按数据值接受，不解析其内容

## Parameters

### value

`unknown`

待检查值；仅接受 null、布尔值、有限数、字符串、连续且无额外属性的数组和普通对象

## Returns

`value is TJson`

符合约束返回 true；循环、访问器、Symbol/非枚举属性或深度超过 64（根为 0）返回 false

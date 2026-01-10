[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/dom](../index.md) / clearWatchPosition

# Function: clearWatchPosition()

> **clearWatchPosition**(`formId`, `panelId?`): `void`

Defined in: [dist/lib/dom.ts:348](https://github.com/maiyun/clickgo/blob/master/dist/lib/dom.ts#L348)

清除某个窗体的所有 watch position 监视，虽然窗体结束后相关监视永远不会再被执行，但是会形成冗余

## Parameters

### formId

`string`

窗体 id

### panelId?

`string`

若指定则只清除当前窗体的某个 panel 的 watch

## Returns

`void`

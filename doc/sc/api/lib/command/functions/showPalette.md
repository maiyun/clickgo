[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / showPalette

# Function: showPalette()

> **showPalette**(`current`, `options?`): `Promise`\<`void`\>

Defined in: lib/command/palette.ts:95

打开原生命令调试面板，也可作为界面操作型代理的可选入口

## Parameters

### current

[`AbstractForm`](../../form/classes/AbstractForm.md)

发起操作的 Form，创建阶段使用其原生 Loading

### options?

是否只显示应用允许代理调用的命令，默认显示全部内部命令

#### exposedOnly?

`boolean`

## Returns

`Promise`\<`void`\>

面板关闭后完成；所属实例失效或正在创建时直接返回

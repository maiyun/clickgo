[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [dist/lib/core.ts:1269](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1269)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [dist/lib/core.ts:1277](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1277)

作者

***

### controls

> **controls**: `string`[]

Defined in: [dist/lib/core.ts:1280](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1280)

将要加载的控件

***

### files?

> `optional` **files**: `string`[]

Defined in: [dist/lib/core.ts:1293](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1293)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon**: `string`

Defined in: [dist/lib/core.ts:1290](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1290)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/core.ts:1286](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1286)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules**: `string`[]

Defined in: [dist/lib/core.ts:1295](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1295)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [dist/lib/core.ts:1271](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1271)

应用名

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [dist/lib/core.ts:1284](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1284)

将自动申请的权限

***

### style?

> `optional` **style**: `string`

Defined in: [dist/lib/core.ts:1288](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1288)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes**: `string`[]

Defined in: [dist/lib/core.ts:1282](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1282)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [dist/lib/core.ts:1273](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1273)

发行版本

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1275](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1275)

发行版本字符串

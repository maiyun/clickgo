[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [dist/lib/core.ts:1250](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1250)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [dist/lib/core.ts:1258](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1258)

作者

***

### controls

> **controls**: `string`[]

Defined in: [dist/lib/core.ts:1261](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1261)

将要加载的控件

***

### files?

> `optional` **files**: `string`[]

Defined in: [dist/lib/core.ts:1274](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1274)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon**: `string`

Defined in: [dist/lib/core.ts:1271](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1271)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/core.ts:1267](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1267)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules**: `string`[]

Defined in: [dist/lib/core.ts:1276](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1276)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [dist/lib/core.ts:1252](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1252)

应用名

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [dist/lib/core.ts:1265](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1265)

将自动申请的权限

***

### style?

> `optional` **style**: `string`

Defined in: [dist/lib/core.ts:1269](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1269)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes**: `string`[]

Defined in: [dist/lib/core.ts:1263](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1263)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [dist/lib/core.ts:1254](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1254)

发行版本

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1256](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1256)

发行版本字符串

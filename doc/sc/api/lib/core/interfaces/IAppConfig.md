[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1297](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1297)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1305](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1305)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1308](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1308)

将要加载的控件

***

### files?

> `optional` **files**: `string`[]

Defined in: [lib/core.ts:1321](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1321)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon**: `string`

Defined in: [lib/core.ts:1318](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1318)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1314](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1314)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules**: `string`[]

Defined in: [lib/core.ts:1323](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1323)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1299](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1299)

应用名

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [lib/core.ts:1312](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1312)

将自动申请的权限

***

### style?

> `optional` **style**: `string`

Defined in: [lib/core.ts:1316](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1316)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes**: `string`[]

Defined in: [lib/core.ts:1310](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1310)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1301](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1301)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1303](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1303)

发行版本字符串

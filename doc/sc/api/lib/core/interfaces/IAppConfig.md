[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [dist/lib/core.ts:1249](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1249)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [dist/lib/core.ts:1257](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1257)

作者

***

### controls

> **controls**: `string`[]

Defined in: [dist/lib/core.ts:1260](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1260)

将要加载的控件

***

### files?

> `optional` **files**: `string`[]

Defined in: [dist/lib/core.ts:1273](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1273)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon**: `string`

Defined in: [dist/lib/core.ts:1270](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1270)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales**: `Record`\<`string`, `string`\>

Defined in: [dist/lib/core.ts:1266](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1266)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules**: `string`[]

Defined in: [dist/lib/core.ts:1275](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1275)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [dist/lib/core.ts:1251](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1251)

应用名

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [dist/lib/core.ts:1264](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1264)

将自动申请的权限

***

### style?

> `optional` **style**: `string`

Defined in: [dist/lib/core.ts:1268](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1268)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes**: `string`[]

Defined in: [dist/lib/core.ts:1262](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1262)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [dist/lib/core.ts:1253](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1253)

发行版本

***

### version

> **version**: `string`

Defined in: [dist/lib/core.ts:1255](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1255)

发行版本字符串

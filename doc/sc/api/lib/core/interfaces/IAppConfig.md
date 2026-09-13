[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1597](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1597)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1605](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1605)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1608](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1608)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1621](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1621)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1618](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1618)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1614](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1614)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1623](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1623)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1599](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1599)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1612](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1612)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1616](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1616)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1610](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1610)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1601](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1601)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1603](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1603)

发行版本字符串

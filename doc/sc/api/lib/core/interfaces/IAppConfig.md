[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1797](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1797)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1805](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1805)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1808](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1808)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1821](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1821)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1818](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1818)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1814](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1814)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1823](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1823)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1799](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1799)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1812](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1812)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1816](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1816)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1810](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1810)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1801](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1801)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1803](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1803)

发行版本字符串

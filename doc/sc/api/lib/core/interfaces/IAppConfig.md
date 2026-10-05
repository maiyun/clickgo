[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1742](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1742)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1750](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1750)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1753](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1753)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1766](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1766)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1763](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1763)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1759](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1759)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1768](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1768)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1744](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1744)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1757](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1757)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1761](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1761)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1755](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1755)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1746](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1746)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1748](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1748)

发行版本字符串

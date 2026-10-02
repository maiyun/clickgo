[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1708](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1708)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1716](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1716)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1719](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1719)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1732](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1732)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1729](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1729)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1725](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1725)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1734](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1734)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1710](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1710)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1723](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1723)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1727](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1727)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1721](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1721)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1712](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1712)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1714](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1714)

发行版本字符串

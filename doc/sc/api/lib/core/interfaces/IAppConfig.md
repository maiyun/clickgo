[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1589](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1589)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1597](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1597)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1600](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1600)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1613](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1613)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1610](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1610)

图标路径，需包含扩展名

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1606](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1606)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1615](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1615)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1591](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1591)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1604](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1604)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1608](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1608)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1602](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1602)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1593](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1593)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1595](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1595)

发行版本字符串

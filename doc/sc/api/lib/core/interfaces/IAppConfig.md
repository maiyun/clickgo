[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1797](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1797)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1810](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1810)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1813](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1813)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1826](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1826)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1823](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1823)

图标路径，需包含扩展名

***

### id?

> `optional` **id?**: `string`

Defined in: [lib/core.ts:1802](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1802)

固定应用 ID，如 net.example.notepad；Native 持久存储必填，跨位置和版本保持不变
1-128 位字母、数字、点、下划线或连字符，以字母或数字开头。

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1819](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1819)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1828](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1828)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1804](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1804)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1817](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1817)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1821](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1821)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1815](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1815)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1806](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1806)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1808](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1808)

发行版本字符串

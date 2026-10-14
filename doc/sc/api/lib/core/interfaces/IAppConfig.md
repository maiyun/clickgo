[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1567](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1567)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1580](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1580)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1583](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1583)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1596](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1596)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1593](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1593)

图标路径，需包含扩展名

***

### id?

> `optional` **id?**: `string`

Defined in: [lib/core.ts:1572](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1572)

固定应用 ID，如 net.example.notepad；Native 持久存储必填，跨位置和版本保持不变
1-128 位字母、数字、点、下划线或连字符，以字母或数字开头。

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1589](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1589)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1598](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1598)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1574](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1574)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1587](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1587)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1591](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1591)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1585](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1585)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1576](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1576)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1578](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1578)

发行版本字符串

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / IAppConfig

# Interface: IAppConfig

Defined in: [lib/core.ts:1485](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1485)

应用文件包 config

## Properties

### author

> **author**: `string`

Defined in: [lib/core.ts:1498](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1498)

作者

***

### controls

> **controls**: `string`[]

Defined in: [lib/core.ts:1501](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1501)

将要加载的控件

***

### files?

> `optional` **files?**: `string`[]

Defined in: [lib/core.ts:1514](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1514)

将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略

***

### icon?

> `optional` **icon?**: `string`

Defined in: [lib/core.ts:1511](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1511)

图标路径，需包含扩展名

***

### id?

> `optional` **id?**: `string`

Defined in: [lib/core.ts:1490](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1490)

固定应用 ID，如 net.example.notepad；Native 持久存储必填，跨位置和版本保持不变
1-128 位字母、数字、点、下划线或连字符，以字母或数字开头。

***

### locales?

> `optional` **locales?**: `Record`\<`string`, `string`\>

Defined in: [lib/core.ts:1507](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1507)

将自动加载的语言包，path: lang

***

### modules?

> `optional` **modules?**: `string`[]

Defined in: [lib/core.ts:1516](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1516)

要提前加载的库名

***

### name

> **name**: `string`

Defined in: [lib/core.ts:1492](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1492)

应用名

***

### permissions?

> `optional` **permissions?**: `string`[]

Defined in: [lib/core.ts:1505](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1505)

将自动申请的权限

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/core.ts:1509](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1509)

全局样式，不带扩展名，系统会在末尾添加 .css

***

### themes?

> `optional` **themes?**: `string`[]

Defined in: [lib/core.ts:1503](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1503)

将自动加载的主题

***

### ver

> **ver**: `number`

Defined in: [lib/core.ts:1494](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1494)

发行版本

***

### version

> **version**: `string`

Defined in: [lib/core.ts:1496](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L1496)

发行版本字符串

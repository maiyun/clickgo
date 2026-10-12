[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/command](../index.md) / IAgentInfo

# Interface: IAgentInfo

Defined in: [lib/command.ts:130](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L130)

可展示或导出的接入信息；命令列表始终从对应入口实时查询

## Properties

### apps

> **apps**: `object`[]

Defined in: [lib/command.ts:132](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L132)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### browser

> **browser**: `object`

Defined in: [lib/command.ts:134](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L134)

#### api

> **api**: `string`

#### url

> **url**: `string` \| `null`

***

### http

> **http**: [`IMcpInfo`](../../native/interfaces/IMcpInfo.md) \| `null`

Defined in: [lib/command.ts:146](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L146)

只有显式导出且通过 root 检查时才包含 HTTP 凭据

***

### native

> **native**: [`ICommandEntry`](../../native/interfaces/ICommandEntry.md) \| `null`

Defined in: [lib/command.ts:144](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L144)

***

### schemaVersion

> **schemaVersion**: `1`

Defined in: [lib/command.ts:131](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L131)

***

### targetTaskId

> **targetTaskId**: `string` \| `null`

Defined in: [lib/command.ts:133](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L133)

***

### webMcp

> **webMcp**: `object`

Defined in: [lib/command.ts:135](https://github.com/maiyun/clickgo/blob/master/dist/lib/command.ts#L135)

#### publishedTaskIds

> **publishedTaskIds**: `string`[]

已完成工具发布的 App，不表示这些 App 分别建立了浏览器连接

#### registrationStatus

> **registrationStatus**: [`TWebMcpRegistrationStatus`](../type-aliases/TWebMcpRegistrationStatus.md) \| `null`

所选 App 的发布诊断；多个 App 时优先报告失败及进行中的注册，不支持时为 null

#### status

> **status**: [`TWebMcpStatus`](../type-aliases/TWebMcpStatus.md)

全页面共用的浏览器接入状态，不受目标 App 或工具数量影响

#### supported

> **supported**: `boolean`

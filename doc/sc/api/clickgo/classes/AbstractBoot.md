[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / AbstractBoot

# Abstract Class: AbstractBoot

Defined in: [clickgo.ts:171](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L171)

全局类

## Constructors

### Constructor

> **new AbstractBoot**(`opt?`): `AbstractBoot`

Defined in: [clickgo.ts:212](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L212)

#### Parameters

##### opt?

###### debug?

`boolean`

#### Returns

`AbstractBoot`

## Properties

### \_sysId

> `protected` **\_sysId**: `string` = `''`

Defined in: [clickgo.ts:198](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L198)

切勿传给 App

## Methods

### isDebug()

> **isDebug**(): `boolean`

Defined in: [clickgo.ts:208](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L208)

判断当前是否是 debug 模式

#### Returns

`boolean`

***

### main()

> `abstract` **main**(): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:221](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L221)

入口方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onActiveChanged()

> **onActiveChanged**(`active`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:234](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L234)

宿主活跃状态改变时广播；初始化不通知，内部切换 Form 不触发

#### Parameters

##### active

`boolean`

页面可见且拥有焦点时为 true；切换页签、窗口或焦点移出页面时为 false

#### Returns

`void` \| `Promise`\<`void`\>

无

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:246](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L246)

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* [`IConfig`](../../lib/core/interfaces/IConfig.md)

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### n

`TK`

##### v

`T`\[`TK`\]

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`taskId`, `formId`, `error`, `info`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:224](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L224)

全局错误事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### error

`Error`

##### info

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:302](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L302)

窗体丢失焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormCreated()

> **onFormCreated**(`taskId`, `formId`, `title`, `icon`, `showInSystemTask`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:252](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L252)

窗体创建事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

##### showInSystemTask

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFlash()

> **onFormFlash**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:308](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L308)

窗体闪烁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormFocused()

> **onFormFocused**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:296](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L296)

窗体获得焦点事件

#### Parameters

##### taskId

`string`

##### formId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormHashChange()

> **onFormHashChange**(`taskId`, `formId`, `value`, `data`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:320](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L320)

窗体的 formHash 改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`string`

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormIconChanged()

> **onFormIconChanged**(`taskId`, `formId`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:272](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L272)

窗体图标改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormRemoved()

> **onFormRemoved**(`taskId`, `formId`, `title`, `icon`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:260](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L260)

窗体销毁事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

##### icon

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowChanged()

> **onFormShowChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:290](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L290)

窗体显示状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormShowInSystemTaskChange()

> **onFormShowInSystemTaskChange**(`taskId`, `formId`, `value`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:314](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L314)

窗体是否显示在任务栏属性改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### value

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMaxChanged()

> **onFormStateMaxChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:284](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L284)

窗体最大化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormStateMinChanged()

> **onFormStateMinChanged**(`taskId`, `formId`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:278](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L278)

窗体最小化状态改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### state

`boolean`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormTitleChanged()

> **onFormTitleChanged**(`taskId`, `formId`, `title`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:266](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L266)

窗体标题改变事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### title

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onHashChanged()

> **onHashChanged**(`hash`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:399](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L399)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:405](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L405)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:411](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L411)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:393](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L393)

launcher 文件夹名称修改事件

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherShowChanged()

> **onLauncherShowChanged**(`state`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:387](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L387)

Launcher 显示状态改变事件

#### Parameters

##### state

`boolean`

是否显示

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onNativeLaunch()

> **onNativeLaunch**(`event`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:178](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L178)

Native 普通启动及再次启动事件；网页不触发，App/Form 要求 root

#### Parameters

##### event

[`INativeLaunchEvent`](../../lib/native/interfaces/INativeLaunchEvent.md)

业务参数、原生工作目录、来源及请求 ID

#### Returns

`void` \| `Promise`\<`void`\>

无；各层级独立收到通知，同一业务动作由应用选择一处执行

***

### onNativeOpenFiles()

> **onNativeOpenFiles**(`paths`, `info`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:189](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L189)

Native 文件打开全局事件，要求宿主启用 openFiles；App/Form 要求 root

#### Parameters

##### paths

`string`[]

不含 /storage/ 的 ClickGo 绝对文件路径

##### info

[`INativeOpenFilesInfo`](../../lib/native/interfaces/INativeOpenFilesInfo.md)

startup、second-instance、association 或 drop 来源及请求 ID

#### Returns

`void` \| `Promise`\<`void`\>

无；各层级独立通知，业务自行确认、保存和打开

***

### onRuntimeFileLoad()

> **onRuntimeFileLoad**(`url`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:417](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L417)

环境文件准备加载时的事件

#### Parameters

##### url

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRuntimeFileLoaded()

> **onRuntimeFileLoaded**(`url`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:423](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L423)

环境文件加载完成的事件

#### Parameters

##### url

`string`

##### state

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:240](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L240)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:367](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L367)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:361](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L361)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrayChanged()

> **onTrayChanged**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:344](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L344)

托盘数据变更通知

#### Parameters

##### taskId

`string`

所属任务

##### trayId

`string`

托盘 ID

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onTrayCreated()

> **onTrayCreated**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:333](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L333)

托盘注册通知；通过 task.getTrayList(this) 读取快照

#### Parameters

##### taskId

`string`

所属任务

##### trayId

`string`

托盘 ID

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onTrayRemoved()

> **onTrayRemoved**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:355](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L355)

托盘删除通知

#### Parameters

##### taskId

`string`

所属任务

##### trayId

`string`

托盘 ID

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onWebMcpStatusChanged()

> **onWebMcpStatusChanged**(`status`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:377](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L377)

页面级 WebMCP 接入状态变化，独立于各 App 的工具发布

#### Parameters

##### status

[`TWebMcpStatus`](../../lib/command/type-aliases/TWebMcpStatus.md)

浏览器接入状态，与 command.getAgentInfo 的 webMcp.status 一致

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### setSysId()

> **setSysId**(`sysId`): `void`

Defined in: [clickgo.ts:200](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L200)

#### Parameters

##### sysId

`string`

#### Returns

`void`

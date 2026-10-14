[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / AbstractApp

# Abstract Class: AbstractApp

Defined in: [lib/core.ts:61](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L61)

App 抽象类

## Constructors

### Constructor

> **new AbstractApp**(): `AbstractApp`

#### Returns

`AbstractApp`

## Properties

### filename

> **filename**: `string` = `''`

Defined in: [lib/core.ts:85](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L85)

当前 js 文件在包内的完整路径

***

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/core.ts:88](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L88)

系统会自动设置本项

## Methods

### main()

> `abstract` **main**(`data`): `Promise`\<`void`\>

Defined in: [lib/core.ts:91](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L91)

App 的入口文件

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:114](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L114)

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* [`IConfig`](../interfaces/IConfig.md)

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

Defined in: [lib/core.ts:102](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L102)

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

Defined in: [lib/core.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L170)

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

Defined in: [lib/core.ts:120](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L120)

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

Defined in: [lib/core.ts:176](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L176)

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

Defined in: [lib/core.ts:164](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L164)

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

Defined in: [lib/core.ts:188](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L188)

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

Defined in: [lib/core.ts:140](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L140)

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

Defined in: [lib/core.ts:128](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L128)

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

Defined in: [lib/core.ts:158](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L158)

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

Defined in: [lib/core.ts:182](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L182)

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

Defined in: [lib/core.ts:152](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L152)

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

Defined in: [lib/core.ts:146](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L146)

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

Defined in: [lib/core.ts:134](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L134)

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

Defined in: [lib/core.ts:288](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L288)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:294](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L294)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:300](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L300)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:282](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L282)

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

Defined in: [lib/core.ts:276](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L276)

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

Defined in: [lib/core.ts:68](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L68)

Native 普通启动及再次启动事件；网页不触发，App/Form 要求 root

#### Parameters

##### event

[`INativeLaunchEvent`](../../native/interfaces/INativeLaunchEvent.md)

业务参数、原生工作目录、来源及请求 ID

#### Returns

`void` \| `Promise`\<`void`\>

无；各层级独立收到通知，同一业务动作由应用选择一处执行

***

### onNativeOpenFiles()

> **onNativeOpenFiles**(`paths`, `info`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:79](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L79)

Native 文件打开全局事件，要求宿主启用 openFiles；App/Form 要求 root

#### Parameters

##### paths

`string`[]

不含 /storage/ 的 ClickGo 绝对文件路径

##### info

[`INativeOpenFilesInfo`](../../native/interfaces/INativeOpenFilesInfo.md)

startup、second-instance、association 或 drop 来源及请求 ID

#### Returns

`void` \| `Promise`\<`void`\>

无；各层级独立通知，业务自行确认、保存和打开

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:108](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L108)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:256](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L256)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:250](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L250)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrayChanged()

> **onTrayChanged**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:212](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L212)

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

### onTrayClick()

> **onTrayClick**(`trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:233](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L233)

自己的托盘左键点击，只投递到所属任务

#### Parameters

##### trayId

`string`

托盘 ID

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onTrayCreated()

> **onTrayCreated**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:201](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L201)

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

### onTrayMenuClick()

> **onTrayMenuClick**(`trayId`, `menuId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:244](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L244)

自己的托盘菜单命令，只投递到所属任务

#### Parameters

##### trayId

`string`

托盘 ID

##### menuId

`string`

菜单命令

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onTrayRemoved()

> **onTrayRemoved**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:223](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L223)

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

Defined in: [lib/core.ts:266](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L266)

页面级 WebMCP 接入状态变化，所有 App 共用同一状态

#### Parameters

##### status

[`TWebMcpStatus`](../../command/type-aliases/TWebMcpStatus.md)

浏览器接入状态，与 command.getAgentInfo 的 webMcp.status 一致

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### run()

> **run**(`form`): `Promise`\<`void`\>

Defined in: [lib/core.ts:97](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L97)

以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败

#### Parameters

##### form

[`AbstractForm`](../../form/classes/AbstractForm.md)

窗体对象

#### Returns

`Promise`\<`void`\>

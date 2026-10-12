[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / AbstractApp

# Abstract Class: AbstractApp

Defined in: [lib/core.ts:60](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L60)

App 抽象类

## Constructors

### Constructor

> **new AbstractApp**(): `AbstractApp`

#### Returns

`AbstractApp`

## Properties

### filename

> **filename**: `string` = `''`

Defined in: [lib/core.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L63)

当前 js 文件在包内的完整路径

***

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/core.ts:66](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L66)

系统会自动设置本项

## Methods

### main()

> `abstract` **main**(`data`): `Promise`\<`void`\>

Defined in: [lib/core.ts:69](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L69)

App 的入口文件

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:92](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L92)

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

Defined in: [lib/core.ts:80](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L80)

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

Defined in: [lib/core.ts:148](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L148)

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

Defined in: [lib/core.ts:98](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L98)

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

Defined in: [lib/core.ts:154](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L154)

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

Defined in: [lib/core.ts:142](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L142)

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

Defined in: [lib/core.ts:166](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L166)

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

Defined in: [lib/core.ts:118](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L118)

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

Defined in: [lib/core.ts:106](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L106)

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

Defined in: [lib/core.ts:136](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L136)

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

Defined in: [lib/core.ts:160](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L160)

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

Defined in: [lib/core.ts:130](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L130)

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

Defined in: [lib/core.ts:124](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L124)

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

Defined in: [lib/core.ts:112](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L112)

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

Defined in: [lib/core.ts:266](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L266)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:272](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L272)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:278](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L278)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:260](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L260)

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

Defined in: [lib/core.ts:254](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L254)

Launcher 显示状态改变事件

#### Parameters

##### state

`boolean`

是否显示

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:86](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L86)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:234](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L234)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:228](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L228)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrayChanged()

> **onTrayChanged**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L190)

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

Defined in: [lib/core.ts:211](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L211)

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

Defined in: [lib/core.ts:179](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L179)

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

Defined in: [lib/core.ts:222](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L222)

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

Defined in: [lib/core.ts:201](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L201)

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

Defined in: [lib/core.ts:244](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L244)

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

Defined in: [lib/core.ts:75](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L75)

以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败

#### Parameters

##### form

[`AbstractForm`](../../form/classes/AbstractForm.md)

窗体对象

#### Returns

`Promise`\<`void`\>

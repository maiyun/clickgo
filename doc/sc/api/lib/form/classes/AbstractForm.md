[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: lib/form/abstract-form.ts:12

窗体的抽象类

## Extends

- `AbstractCommon`

## Constructors

### Constructor

> **new AbstractForm**(): `AbstractForm`

#### Returns

`AbstractForm`

#### Inherited from

`AbstractCommon.constructor`

## Properties

### components

> `readonly` **components**: `Record`\<`string`, () => [`AbstractComponent`](AbstractComponent.md)\> = `{}`

Defined in: lib/form/base.ts:14

当前视图内局部注册的应用组件

#### Inherited from

`AbstractCommon.components`

***

### dialogResult

> **dialogResult**: `string` = `''`

Defined in: lib/form/abstract-form.ts:322

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: lib/form/abstract-form.ts:41

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: lib/form/abstract-form.ts:38

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: lib/form/abstract-form.ts:193

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: lib/form/abstract-form.ts:78

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: lib/form/abstract-form.ts:83

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: lib/form/base.ts:106

layout 中 :class 的转义

##### Returns

(`cla`) => `string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: lib/form/base.ts:23

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: lib/form/base.ts:27

##### Parameters

###### v

`string`

##### Returns

`void`

#### Inherited from

`AbstractCommon.controlName`

***

### element

#### Get Signature

> **get** **element**(): `HTMLElement`

Defined in: lib/form/base.ts:141

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: lib/form/base.ts:17

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: lib/form/abstract-form.ts:44

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: lib/form/abstract-form.ts:108

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: lib/form/abstract-form.ts:50

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: lib/form/abstract-form.ts:54

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: lib/form/abstract-form.ts:59

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: lib/form/abstract-form.ts:63

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: lib/form/base.ts:43

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: lib/form/abstract-form.ts:200

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: lib/form/abstract-form.ts:90

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: lib/form/base.ts:87

获取语言内容

##### Returns

(`key`, `data?`, `origin?`) => `string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: lib/form/abstract-form.ts:181

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: lib/form/abstract-form.ts:185

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: lib/form/base.ts:69

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### localeDirection

#### Get Signature

> **get** **localeDirection**(): `"ltr"` \| `"rtl"`

Defined in: lib/form/base.ts:80

当前语言的书写方向

##### Returns

`"ltr"` \| `"rtl"`

#### Inherited from

`AbstractCommon.localeDirection`

***

### localeTag

#### Get Signature

> **get** **localeTag**(): `string`

Defined in: lib/form/base.ts:75

当前语言的标准 HTML lang 标签

##### Returns

`string`

#### Inherited from

`AbstractCommon.localeTag`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: lib/form/base.ts:148

等待渲染

##### Returns

() => `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: lib/form/base.ts:57

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: lib/form/base.ts:63

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: lib/form/base.ts:136

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: lib/form/abstract-form.ts:114

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: lib/form/abstract-form.ts:119

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: lib/form/base.ts:37

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: lib/form/abstract-form.ts:68

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: lib/form/abstract-form.ts:73

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: lib/form/base.ts:156

判断当前事件可否执行

#### Parameters

##### e

`PointerEvent` \| `KeyboardEvent`

鼠标、触摸、键盘事件

#### Returns

`boolean`

#### Inherited from

`AbstractCommon.allowEvent`

***

### close()

> **close**(): `void`

Defined in: lib/form/abstract-form.ts:315

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:247

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: lib/form/abstract-form.ts:208

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:130

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: lib/form/abstract-form.ts:307

让窗体隐藏

#### Returns

`void`

***

### onActiveChanged()

> **onActiveChanged**(`active`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:342

宿主活跃状态改变时广播；初始化不通知，内部切换 Form 不触发

#### Parameters

##### active

`boolean`

页面可见且拥有焦点时为 true；切换页签、窗口或焦点移出页面时为 false

#### Returns

`void` \| `Promise`\<`void`\>

无

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:186

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:194

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:206

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:198

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: lib/form/abstract-form.ts:354

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* keyof [`IConfig`](../../core/interfaces/IConfig.md)

#### Parameters

##### n

keyof [`IConfig`](../../core/interfaces/IConfig.md)

##### v

[`IConfig`](../../core/interfaces/IConfig.md)\[`T`\]

#### Returns

`void`

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:190

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:410

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

Defined in: lib/form/abstract-form.ts:360

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

Defined in: lib/form/abstract-form.ts:416

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

Defined in: lib/form/abstract-form.ts:404

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

Defined in: lib/form/abstract-form.ts:428

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

Defined in: lib/form/abstract-form.ts:380

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

Defined in: lib/form/abstract-form.ts:368

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

Defined in: lib/form/abstract-form.ts:398

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

Defined in: lib/form/abstract-form.ts:422

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

Defined in: lib/form/abstract-form.ts:392

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

Defined in: lib/form/abstract-form.ts:386

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

Defined in: lib/form/abstract-form.ts:374

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

Defined in: lib/form/abstract-form.ts:528

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:534

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:540

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:522

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

Defined in: lib/form/abstract-form.ts:516

Launcher 显示状态改变事件

#### Parameters

##### state

`boolean`

是否显示

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### onMounted()

> **onMounted**(`data`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:326

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onNativeLaunch()

> **onNativeLaunch**(`event`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:19

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

Defined in: lib/form/abstract-form.ts:30

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

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:332

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:348

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:496

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:490

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrayChanged()

> **onTrayChanged**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:452

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

Defined in: lib/form/abstract-form.ts:473

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

Defined in: lib/form/abstract-form.ts:441

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

Defined in: lib/form/abstract-form.ts:484

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

Defined in: lib/form/abstract-form.ts:463

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

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:210

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:202

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### onWebMcpStatusChanged()

> **onWebMcpStatusChanged**(`status`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:506

页面级 WebMCP 接入状态变化，所有 Form 共用同一状态

#### Parameters

##### status

[`TWebMcpStatus`](../../command/type-aliases/TWebMcpStatus.md)

浏览器接入状态，与 command.getAgentInfo 的 webMcp.status 一致

#### Returns

`void` \| `Promise`\<`void`\>

无返回值

***

### ready()

> **ready**(`cb`): `void`

Defined in: lib/form/abstract-form.ts:124

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: lib/form/base.ts:178

给一个窗体发送一个对象，不会知道成功与失败状态

#### Parameters

##### fid

`string`

formId 要接收对象的 form id

##### obj

`Record`\<`string`, `any`\>

要发送的对象

#### Returns

`void`

#### Inherited from

`AbstractCommon.send`

***

### sendToPanel()

> **sendToPanel**(`panel`, `data`): `void`

Defined in: lib/form/abstract-form.ts:173

发送一段数据到 panel 控件，本质上也是调用的 panel 控件的 send 方法

#### Parameters

##### panel

[`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### show()

> **show**(): `Promise`\<`void`\>

Defined in: lib/form/abstract-form.ts:261

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: lib/form/abstract-form.ts:286

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: lib/form/base.ts:166

触发系统方法

#### Parameters

##### name

[`TGlobalEvent`](../../core/type-aliases/TGlobalEvent.md)

方法名

##### param1?

`string` \| `boolean` \| `Error`

参数1

##### param2?

`string` = `''`

参数2

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractCommon.trigger`

***

### updateStep()

> **updateStep**(`index`, `value`): `boolean`

Defined in: lib/form/abstract-form.ts:235

更新步进条，用于动态改变某个项的 hash 值时使用

#### Parameters

##### index

`number`

##### value

`string`

#### Returns

`boolean`

***

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt?`): () => `void`

Defined in: lib/form/base.ts:122

监视变动

#### Type Parameters

##### T

`T` *extends* `AbstractForm`

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

##### TR

`TR`

#### Parameters

##### name

`TK` \| (() => `TR`)

监视的属性

##### cb

(`val`, `old`) => `void` \| `Promise`\<`void`\>

回调

##### opt?

参数

###### deep?

`boolean`

###### immediate?

`boolean`

#### Returns

() => `void`

#### Inherited from

`AbstractCommon.watch`

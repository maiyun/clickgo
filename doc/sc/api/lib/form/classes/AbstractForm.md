[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: [lib/form.ts:544](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L544)

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

### dialogResult

> **dialogResult**: `string` = `''`

Defined in: [lib/form.ts:833](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L833)

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: [lib/form.ts:552](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L552)

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [lib/form.ts:549](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L549)

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: [lib/form.ts:704](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L704)

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: [lib/form.ts:589](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L589)

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: [lib/form.ts:594](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L594)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/form.ts:316](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L316)

layout 中 :class 的转义

##### Returns

(`cla`) => `string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/form.ts:243](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L243)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [lib/form.ts:247](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L247)

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

Defined in: [lib/form.ts:351](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L351)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/form.ts:237](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L237)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/form.ts:555](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L555)

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:619](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L619)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [lib/form.ts:561](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L561)

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: [lib/form.ts:565](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L565)

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:570](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L570)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [lib/form.ts:574](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L574)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/form.ts:263](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L263)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: [lib/form.ts:711](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L711)

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: [lib/form.ts:601](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L601)

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [lib/form.ts:297](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L297)

获取语言内容

##### Returns

(`key`, `data?`, `origin?`) => `string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: [lib/form.ts:692](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L692)

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: [lib/form.ts:696](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L696)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/form.ts:289](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L289)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/form.ts:358](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L358)

等待渲染

##### Returns

() => `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/form.ts:277](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L277)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/form.ts:283](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L283)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [lib/form.ts:346](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L346)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: [lib/form.ts:625](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L625)

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: [lib/form.ts:630](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L630)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/form.ts:257](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L257)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: [lib/form.ts:579](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L579)

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: [lib/form.ts:584](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L584)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/form.ts:366](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L366)

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

Defined in: [lib/form.ts:826](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L826)

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:758](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L758)

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [lib/form.ts:719](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L719)

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:641](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L641)

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: [lib/form.ts:818](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L818)

让窗体隐藏

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:396](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L396)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:404](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L404)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:416](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L416)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:408](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L408)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: [lib/form.ts:855](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L855)

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

Defined in: [lib/form.ts:400](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L400)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:911](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L911)

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

Defined in: [lib/form.ts:861](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L861)

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

Defined in: [lib/form.ts:917](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L917)

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

Defined in: [lib/form.ts:905](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L905)

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

Defined in: [lib/form.ts:929](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L929)

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

Defined in: [lib/form.ts:881](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L881)

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

Defined in: [lib/form.ts:869](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L869)

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

Defined in: [lib/form.ts:899](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L899)

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

Defined in: [lib/form.ts:923](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L923)

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

Defined in: [lib/form.ts:893](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L893)

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

Defined in: [lib/form.ts:887](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L887)

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

Defined in: [lib/form.ts:875](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L875)

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

Defined in: [lib/form.ts:955](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L955)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:961](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L961)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:967](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L967)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:949](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L949)

launcher 文件夹名称修改事件

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:837](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L837)

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:843](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L843)

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:849](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L849)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:943](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L943)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:937](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L937)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:420](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L420)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:412](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L412)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### ready()

> **ready**(`cb`): `void`

Defined in: [lib/form.ts:635](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L635)

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [lib/form.ts:388](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L388)

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

Defined in: [lib/form.ts:684](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L684)

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

Defined in: [lib/form.ts:772](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L772)

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: [lib/form.ts:797](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L797)

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/form.ts:376](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L376)

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

Defined in: [lib/form.ts:746](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L746)

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

Defined in: [lib/form.ts:332](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L332)

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

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: [dist/lib/form.ts:477](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L477)

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

Defined in: [dist/lib/form.ts:762](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L762)

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: [dist/lib/form.ts:485](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L485)

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [dist/lib/form.ts:482](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L482)

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: [dist/lib/form.ts:633](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L633)

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: [dist/lib/form.ts:522](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L522)

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: [dist/lib/form.ts:527](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L527)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [dist/lib/form.ts:249](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L249)

layout 中 :class 的转义

##### Returns

> (`cla`): `string`

###### Parameters

###### cla

`any`

###### Returns

`string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [dist/lib/form.ts:176](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L176)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [dist/lib/form.ts:180](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L180)

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

Defined in: [dist/lib/form.ts:284](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L284)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [dist/lib/form.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L170)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [dist/lib/form.ts:488](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L488)

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [dist/lib/form.ts:548](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L548)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [dist/lib/form.ts:494](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L494)

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: [dist/lib/form.ts:498](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L498)

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [dist/lib/form.ts:503](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L503)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [dist/lib/form.ts:507](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L507)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [dist/lib/form.ts:196](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L196)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: [dist/lib/form.ts:640](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L640)

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: [dist/lib/form.ts:534](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L534)

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [dist/lib/form.ts:230](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L230)

获取语言内容

##### Returns

> (`key`, `data?`, `origin?`): `string`

###### Parameters

###### key

`string`

###### data?

`string`[]

###### origin?

`boolean`

###### Returns

`string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: [dist/lib/form.ts:621](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L621)

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: [dist/lib/form.ts:625](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L625)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [dist/lib/form.ts:222](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L222)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:291](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L291)

等待渲染

##### Returns

> (): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [dist/lib/form.ts:210](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L210)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [dist/lib/form.ts:216](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L216)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [dist/lib/form.ts:279](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L279)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: [dist/lib/form.ts:554](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L554)

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: [dist/lib/form.ts:559](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L559)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [dist/lib/form.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L190)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: [dist/lib/form.ts:512](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L512)

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: [dist/lib/form.ts:517](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L517)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [dist/lib/form.ts:299](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L299)

判断当前事件可否执行

#### Parameters

##### e

鼠标、触摸、键盘事件

`PointerEvent` | `KeyboardEvent`

#### Returns

`boolean`

#### Inherited from

`AbstractCommon.allowEvent`

***

### close()

> **close**(): `void`

Defined in: [dist/lib/form.ts:755](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L755)

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:687](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L687)

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [dist/lib/form.ts:648](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L648)

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:570](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L570)

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: [dist/lib/form.ts:747](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L747)

让窗体隐藏

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:329](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L329)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:337](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L337)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:349](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L349)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:341](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L341)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: [dist/lib/form.ts:784](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L784)

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

Defined in: [dist/lib/form.ts:333](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L333)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:840](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L840)

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

Defined in: [dist/lib/form.ts:790](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L790)

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

Defined in: [dist/lib/form.ts:846](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L846)

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

Defined in: [dist/lib/form.ts:834](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L834)

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

Defined in: [dist/lib/form.ts:858](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L858)

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

Defined in: [dist/lib/form.ts:810](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L810)

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

Defined in: [dist/lib/form.ts:798](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L798)

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

Defined in: [dist/lib/form.ts:828](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L828)

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

Defined in: [dist/lib/form.ts:852](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L852)

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

Defined in: [dist/lib/form.ts:822](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L822)

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

Defined in: [dist/lib/form.ts:816](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L816)

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

Defined in: [dist/lib/form.ts:804](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L804)

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

Defined in: [dist/lib/form.ts:884](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L884)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:890](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L890)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:896](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L896)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:878](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L878)

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

Defined in: [dist/lib/form.ts:766](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L766)

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:772](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L772)

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:778](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L778)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:872](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L872)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:866](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L866)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:353](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L353)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:345](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L345)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### ready()

> **ready**(`cb`): `void`

Defined in: [dist/lib/form.ts:564](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L564)

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [dist/lib/form.ts:321](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L321)

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

Defined in: [dist/lib/form.ts:613](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L613)

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

Defined in: [dist/lib/form.ts:701](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L701)

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: [dist/lib/form.ts:726](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L726)

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1`, `param2`): `Promise`\<`void`\>

Defined in: [dist/lib/form.ts:309](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L309)

触发系统方法

#### Parameters

##### name

[`TGlobalEvent`](../../core/type-aliases/TGlobalEvent.md)

方法名

##### param1

参数1

`string` | `boolean` | `Error`

##### param2

`string` = `''`

参数2

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractCommon.trigger`

***

### updateStep()

> **updateStep**(`index`, `value`): `boolean`

Defined in: [dist/lib/form.ts:675](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L675)

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

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt`): () => `void`

Defined in: [dist/lib/form.ts:265](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L265)

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

监视的属性

`TK` | () => `TR`

##### cb

(`val`, `old`) => `void` \| `Promise`\<`void`\>

回调

##### opt

参数

###### deep?

`boolean`

###### immediate?

`boolean`

#### Returns

> (): `void`

##### Returns

`void`

#### Inherited from

`AbstractCommon.watch`

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: [lib/form.ts:919](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L919)

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

Defined in: [lib/form.ts:239](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L239)

当前视图内局部注册的应用组件

#### Inherited from

`AbstractCommon.components`

***

### dialogResult

> **dialogResult**: `string` = `''`

Defined in: [lib/form.ts:1208](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1208)

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: [lib/form.ts:927](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L927)

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [lib/form.ts:924](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L924)

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: [lib/form.ts:1079](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1079)

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: [lib/form.ts:964](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L964)

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: [lib/form.ts:969](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L969)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/form.ts:321](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L321)

layout 中 :class 的转义

##### Returns

(`cla`) => `string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/form.ts:248](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L248)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [lib/form.ts:252](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L252)

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

Defined in: [lib/form.ts:356](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L356)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/form.ts:242](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L242)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/form.ts:930](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L930)

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:994](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L994)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [lib/form.ts:936](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L936)

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: [lib/form.ts:940](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L940)

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:945](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L945)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [lib/form.ts:949](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L949)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/form.ts:268](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L268)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: [lib/form.ts:1086](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1086)

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: [lib/form.ts:976](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L976)

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [lib/form.ts:302](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L302)

获取语言内容

##### Returns

(`key`, `data?`, `origin?`) => `string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: [lib/form.ts:1067](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1067)

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: [lib/form.ts:1071](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1071)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/form.ts:294](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L294)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/form.ts:363](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L363)

等待渲染

##### Returns

() => `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/form.ts:282](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L282)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/form.ts:288](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L288)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [lib/form.ts:351](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L351)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: [lib/form.ts:1000](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1000)

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: [lib/form.ts:1005](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1005)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/form.ts:262](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L262)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: [lib/form.ts:954](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L954)

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: [lib/form.ts:959](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L959)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/form.ts:371](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L371)

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

Defined in: [lib/form.ts:1201](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1201)

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1133](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1133)

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [lib/form.ts:1094](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1094)

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1016](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1016)

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: [lib/form.ts:1193](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1193)

让窗体隐藏

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:401](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L401)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:409](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L409)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:421](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L421)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:413](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L413)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: [lib/form.ts:1230](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1230)

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

Defined in: [lib/form.ts:405](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L405)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1286](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1286)

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

Defined in: [lib/form.ts:1236](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1236)

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

Defined in: [lib/form.ts:1292](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1292)

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

Defined in: [lib/form.ts:1280](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1280)

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

Defined in: [lib/form.ts:1304](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1304)

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

Defined in: [lib/form.ts:1256](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1256)

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

Defined in: [lib/form.ts:1244](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1244)

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

Defined in: [lib/form.ts:1274](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1274)

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

Defined in: [lib/form.ts:1298](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1298)

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

Defined in: [lib/form.ts:1268](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1268)

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

Defined in: [lib/form.ts:1262](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1262)

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

Defined in: [lib/form.ts:1250](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1250)

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

Defined in: [lib/form.ts:1330](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1330)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1336](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1336)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1342](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1342)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1324](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1324)

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

Defined in: [lib/form.ts:1212](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1212)

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1218](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1218)

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1224](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1224)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1318](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1318)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1312](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1312)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:425](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L425)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:417](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L417)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### ready()

> **ready**(`cb`): `void`

Defined in: [lib/form.ts:1010](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1010)

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [lib/form.ts:393](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L393)

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

Defined in: [lib/form.ts:1059](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1059)

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

Defined in: [lib/form.ts:1147](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1147)

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: [lib/form.ts:1172](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1172)

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/form.ts:381](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L381)

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

Defined in: [lib/form.ts:1121](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1121)

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

Defined in: [lib/form.ts:337](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L337)

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

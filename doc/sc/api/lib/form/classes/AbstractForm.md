[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: [lib/form.ts:961](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L961)

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

Defined in: [lib/form.ts:271](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L271)

当前视图内局部注册的应用组件

#### Inherited from

`AbstractCommon.components`

***

### dialogResult

> **dialogResult**: `string` = `''`

Defined in: [lib/form.ts:1250](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1250)

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: [lib/form.ts:969](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L969)

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [lib/form.ts:966](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L966)

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: [lib/form.ts:1121](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1121)

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: [lib/form.ts:1006](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1006)

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: [lib/form.ts:1011](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1011)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/form.ts:363](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L363)

layout 中 :class 的转义

##### Returns

(`cla`) => `string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/form.ts:280](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L280)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [lib/form.ts:284](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L284)

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

Defined in: [lib/form.ts:398](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L398)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/form.ts:274](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L274)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/form.ts:972](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L972)

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:1036](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1036)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [lib/form.ts:978](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L978)

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: [lib/form.ts:982](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L982)

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:987](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L987)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [lib/form.ts:991](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L991)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/form.ts:300](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L300)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: [lib/form.ts:1128](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1128)

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: [lib/form.ts:1018](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1018)

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [lib/form.ts:344](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L344)

获取语言内容

##### Returns

(`key`, `data?`, `origin?`) => `string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: [lib/form.ts:1109](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1109)

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: [lib/form.ts:1113](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1113)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/form.ts:326](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L326)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### localeDirection

#### Get Signature

> **get** **localeDirection**(): `"ltr"` \| `"rtl"`

Defined in: [lib/form.ts:337](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L337)

当前语言的书写方向

##### Returns

`"ltr"` \| `"rtl"`

#### Inherited from

`AbstractCommon.localeDirection`

***

### localeTag

#### Get Signature

> **get** **localeTag**(): `string`

Defined in: [lib/form.ts:332](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L332)

当前语言的标准 HTML lang 标签

##### Returns

`string`

#### Inherited from

`AbstractCommon.localeTag`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/form.ts:405](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L405)

等待渲染

##### Returns

() => `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/form.ts:314](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L314)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/form.ts:320](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L320)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [lib/form.ts:393](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L393)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: [lib/form.ts:1042](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1042)

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: [lib/form.ts:1047](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1047)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/form.ts:294](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L294)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: [lib/form.ts:996](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L996)

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: [lib/form.ts:1001](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1001)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/form.ts:413](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L413)

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

Defined in: [lib/form.ts:1243](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1243)

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1175](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1175)

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [lib/form.ts:1136](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1136)

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1058](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1058)

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: [lib/form.ts:1235](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1235)

让窗体隐藏

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:443](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L443)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:451](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L451)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:463](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L463)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:455](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L455)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: [lib/form.ts:1272](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1272)

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

Defined in: [lib/form.ts:447](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L447)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1328](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1328)

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

Defined in: [lib/form.ts:1278](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1278)

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

Defined in: [lib/form.ts:1334](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1334)

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

Defined in: [lib/form.ts:1322](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1322)

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

Defined in: [lib/form.ts:1346](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1346)

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

Defined in: [lib/form.ts:1298](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1298)

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

Defined in: [lib/form.ts:1286](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1286)

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

Defined in: [lib/form.ts:1316](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1316)

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

Defined in: [lib/form.ts:1340](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1340)

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

Defined in: [lib/form.ts:1310](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1310)

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

Defined in: [lib/form.ts:1304](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1304)

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

Defined in: [lib/form.ts:1292](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1292)

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

Defined in: [lib/form.ts:1436](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1436)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1442](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1442)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1448](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1448)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1430](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1430)

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

Defined in: [lib/form.ts:1424](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1424)

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

Defined in: [lib/form.ts:1254](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1254)

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1260](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1260)

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1266](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1266)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1414](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1414)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1408](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1408)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrayChanged()

> **onTrayChanged**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1370](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1370)

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

Defined in: [lib/form.ts:1391](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1391)

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

Defined in: [lib/form.ts:1359](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1359)

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

Defined in: [lib/form.ts:1402](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1402)

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

Defined in: [lib/form.ts:1381](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1381)

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

Defined in: [lib/form.ts:467](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L467)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:459](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L459)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### ready()

> **ready**(`cb`): `void`

Defined in: [lib/form.ts:1052](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1052)

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [lib/form.ts:435](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L435)

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

Defined in: [lib/form.ts:1101](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1101)

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

Defined in: [lib/form.ts:1189](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1189)

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: [lib/form.ts:1214](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1214)

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/form.ts:423](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L423)

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

Defined in: [lib/form.ts:1163](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1163)

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

Defined in: [lib/form.ts:379](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L379)

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

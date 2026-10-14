[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: [lib/form.ts:963](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L963)

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

Defined in: [lib/form.ts:273](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L273)

当前视图内局部注册的应用组件

#### Inherited from

`AbstractCommon.components`

***

### dialogResult

> **dialogResult**: `string` = `''`

Defined in: [lib/form.ts:1273](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1273)

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: [lib/form.ts:992](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L992)

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [lib/form.ts:989](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L989)

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: [lib/form.ts:1144](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1144)

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: [lib/form.ts:1029](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1029)

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: [lib/form.ts:1034](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1034)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/form.ts:365](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L365)

layout 中 :class 的转义

##### Returns

(`cla`) => `string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/form.ts:282](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L282)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [lib/form.ts:286](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L286)

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

Defined in: [lib/form.ts:400](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L400)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/form.ts:276](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L276)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/form.ts:995](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L995)

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:1059](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1059)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [lib/form.ts:1001](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1001)

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: [lib/form.ts:1005](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1005)

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:1010](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1010)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [lib/form.ts:1014](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1014)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/form.ts:302](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L302)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: [lib/form.ts:1151](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1151)

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: [lib/form.ts:1041](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1041)

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [lib/form.ts:346](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L346)

获取语言内容

##### Returns

(`key`, `data?`, `origin?`) => `string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: [lib/form.ts:1132](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1132)

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: [lib/form.ts:1136](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1136)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/form.ts:328](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L328)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### localeDirection

#### Get Signature

> **get** **localeDirection**(): `"ltr"` \| `"rtl"`

Defined in: [lib/form.ts:339](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L339)

当前语言的书写方向

##### Returns

`"ltr"` \| `"rtl"`

#### Inherited from

`AbstractCommon.localeDirection`

***

### localeTag

#### Get Signature

> **get** **localeTag**(): `string`

Defined in: [lib/form.ts:334](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L334)

当前语言的标准 HTML lang 标签

##### Returns

`string`

#### Inherited from

`AbstractCommon.localeTag`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/form.ts:407](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L407)

等待渲染

##### Returns

() => `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/form.ts:316](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L316)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/form.ts:322](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L322)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [lib/form.ts:395](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L395)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: [lib/form.ts:1065](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1065)

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: [lib/form.ts:1070](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1070)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/form.ts:296](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L296)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: [lib/form.ts:1019](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1019)

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: [lib/form.ts:1024](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1024)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/form.ts:415](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L415)

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

Defined in: [lib/form.ts:1266](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1266)

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1198](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1198)

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [lib/form.ts:1159](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1159)

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1081](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1081)

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: [lib/form.ts:1258](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1258)

让窗体隐藏

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:445](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L445)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:453](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L453)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:465](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L465)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:457](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L457)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: [lib/form.ts:1295](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1295)

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

Defined in: [lib/form.ts:449](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L449)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1351](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1351)

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

Defined in: [lib/form.ts:1301](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1301)

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

Defined in: [lib/form.ts:1357](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1357)

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

Defined in: [lib/form.ts:1345](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1345)

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

Defined in: [lib/form.ts:1369](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1369)

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

Defined in: [lib/form.ts:1321](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1321)

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

Defined in: [lib/form.ts:1309](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1309)

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

Defined in: [lib/form.ts:1339](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1339)

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

Defined in: [lib/form.ts:1363](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1363)

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

Defined in: [lib/form.ts:1333](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1333)

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

Defined in: [lib/form.ts:1327](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1327)

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

Defined in: [lib/form.ts:1315](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1315)

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

Defined in: [lib/form.ts:1469](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1469)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1475](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1475)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1481](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1481)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1463](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1463)

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

Defined in: [lib/form.ts:1457](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1457)

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

Defined in: [lib/form.ts:1277](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1277)

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onNativeLaunch()

> **onNativeLaunch**(`event`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:970](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L970)

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

Defined in: [lib/form.ts:981](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L981)

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

Defined in: [lib/form.ts:1283](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1283)

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1289](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1289)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1437](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1437)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1431](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1431)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrayChanged()

> **onTrayChanged**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1393](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1393)

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

Defined in: [lib/form.ts:1414](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1414)

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

Defined in: [lib/form.ts:1382](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1382)

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

Defined in: [lib/form.ts:1425](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1425)

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

Defined in: [lib/form.ts:1404](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1404)

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

Defined in: [lib/form.ts:469](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L469)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:461](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L461)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### onWebMcpStatusChanged()

> **onWebMcpStatusChanged**(`status`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1447](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1447)

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

Defined in: [lib/form.ts:1075](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1075)

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [lib/form.ts:437](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L437)

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

Defined in: [lib/form.ts:1124](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1124)

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

Defined in: [lib/form.ts:1212](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1212)

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: [lib/form.ts:1237](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1237)

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/form.ts:425](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L425)

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

Defined in: [lib/form.ts:1186](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1186)

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

Defined in: [lib/form.ts:381](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L381)

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

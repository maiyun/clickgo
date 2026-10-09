[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractForm

# Abstract Class: AbstractForm

Defined in: [lib/form.ts:962](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L962)

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

Defined in: [lib/form.ts:272](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L272)

当前视图内局部注册的应用组件

#### Inherited from

`AbstractCommon.components`

***

### dialogResult

> **dialogResult**: `string` = `''`

Defined in: [lib/form.ts:1251](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1251)

dialog mask 窗体返回值，在 close 之后会进行传导

***

### isNativeNoFrameFirst

> **isNativeNoFrameFirst**: `boolean` = `false`

Defined in: [lib/form.ts:970](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L970)

是否是 native 下无边框的第一个窗体

***

### isReady

> **isReady**: `boolean` = `false`

Defined in: [lib/form.ts:967](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L967)

当前是否完全创建完毕

***

### lockLoading

> **lockLoading**: `boolean` = `false`

Defined in: [lib/form.ts:1122](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1122)

是否阻止任何人修改 loading

## Accessors

### bottomMost

#### Get Signature

> **get** **bottomMost**(): `boolean`

Defined in: [lib/form.ts:1007](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1007)

是否是置底

##### Returns

`boolean`

#### Set Signature

> **set** **bottomMost**(`v`): `void`

Defined in: [lib/form.ts:1012](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1012)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/form.ts:364](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L364)

layout 中 :class 的转义

##### Returns

(`cla`) => `string`

#### Inherited from

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/form.ts:281](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L281)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [lib/form.ts:285](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L285)

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

Defined in: [lib/form.ts:399](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L399)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/form.ts:275](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L275)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/form.ts:973](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L973)

当前的窗体创建的位数

##### Returns

`number`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:1037](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1037)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [lib/form.ts:979](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L979)

获取 form 的 hash 值，不是浏览器的 hash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`v`): `void`

Defined in: [lib/form.ts:983](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L983)

##### Parameters

###### v

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:988](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L988)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [lib/form.ts:992](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L992)

##### Parameters

###### v

`Record`\<`string`, `any`\>

##### Returns

`void`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/form.ts:301](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L301)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### inStep

#### Get Signature

> **get** **inStep**(): `boolean`

Defined in: [lib/form.ts:1129](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1129)

当前是否在 step 环节中

##### Returns

`boolean`

***

### isMask

#### Get Signature

> **get** **isMask**(): `boolean`

Defined in: [lib/form.ts:1019](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1019)

是否在本窗体上显示遮罩层

##### Returns

`boolean`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`, `origin?`) => `string`

Defined in: [lib/form.ts:345](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L345)

获取语言内容

##### Returns

(`key`, `data?`, `origin?`) => `string`

#### Inherited from

`AbstractCommon.l`

***

### loading

#### Get Signature

> **get** **loading**(): `boolean`

Defined in: [lib/form.ts:1110](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1110)

覆盖整个窗体的 loading

##### Returns

`boolean`

#### Set Signature

> **set** **loading**(`val`): `void`

Defined in: [lib/form.ts:1114](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1114)

##### Parameters

###### val

`boolean`

##### Returns

`void`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/form.ts:327](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L327)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### localeDirection

#### Get Signature

> **get** **localeDirection**(): `"ltr"` \| `"rtl"`

Defined in: [lib/form.ts:338](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L338)

当前语言的书写方向

##### Returns

`"ltr"` \| `"rtl"`

#### Inherited from

`AbstractCommon.localeDirection`

***

### localeTag

#### Get Signature

> **get** **localeTag**(): `string`

Defined in: [lib/form.ts:333](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L333)

当前语言的标准 HTML lang 标签

##### Returns

`string`

#### Inherited from

`AbstractCommon.localeTag`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/form.ts:406](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L406)

等待渲染

##### Returns

() => `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/form.ts:315](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L315)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/form.ts:321](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L321)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [lib/form.ts:394](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L394)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### showInSystemTask

#### Get Signature

> **get** **showInSystemTask**(): `boolean`

Defined in: [lib/form.ts:1043](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1043)

当前窗体是否显示在任务栏

##### Returns

`boolean`

#### Set Signature

> **set** **showInSystemTask**(`v`): `void`

Defined in: [lib/form.ts:1048](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1048)

##### Parameters

###### v

`boolean`

##### Returns

`void`

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/form.ts:295](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L295)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

***

### topMost

#### Get Signature

> **get** **topMost**(): `boolean`

Defined in: [lib/form.ts:997](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L997)

是否是置顶

##### Returns

`boolean`

#### Set Signature

> **set** **topMost**(`v`): `void`

Defined in: [lib/form.ts:1002](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1002)

##### Parameters

###### v

`boolean`

##### Returns

`void`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/form.ts:414](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L414)

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

Defined in: [lib/form.ts:1244](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1244)

关闭当前窗体

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1176](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1176)

完成当前步骤条

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [lib/form.ts:1137](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1137)

进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:1059](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1059)

form hash 回退

#### Returns

`Promise`\<`void`\>

***

### hide()

> **hide**(): `void`

Defined in: [lib/form.ts:1236](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1236)

让窗体隐藏

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:444](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L444)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:452](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L452)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:464](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L464)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:456](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L456)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onConfigChanged()

> **onConfigChanged**\<`T`\>(`n`, `v`): `void`

Defined in: [lib/form.ts:1273](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1273)

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

Defined in: [lib/form.ts:448](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L448)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1329](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1329)

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

Defined in: [lib/form.ts:1279](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1279)

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

Defined in: [lib/form.ts:1335](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1335)

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

Defined in: [lib/form.ts:1323](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1323)

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

Defined in: [lib/form.ts:1347](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1347)

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

Defined in: [lib/form.ts:1299](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1299)

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

Defined in: [lib/form.ts:1287](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1287)

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

Defined in: [lib/form.ts:1317](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1317)

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

Defined in: [lib/form.ts:1341](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1341)

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

Defined in: [lib/form.ts:1311](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1311)

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

Defined in: [lib/form.ts:1305](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1305)

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

Defined in: [lib/form.ts:1293](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1293)

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

Defined in: [lib/form.ts:1437](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1437)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1443](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1443)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1449](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1449)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1431](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1431)

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

Defined in: [lib/form.ts:1425](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1425)

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

Defined in: [lib/form.ts:1255](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1255)

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1261](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1261)

接收 send 传递过来的 data 数据

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1267](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1267)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1415](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1415)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1409](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1409)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrayChanged()

> **onTrayChanged**(`taskId`, `trayId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:1371](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1371)

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

Defined in: [lib/form.ts:1392](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1392)

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

Defined in: [lib/form.ts:1360](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1360)

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

Defined in: [lib/form.ts:1403](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1403)

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

Defined in: [lib/form.ts:1382](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1382)

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

Defined in: [lib/form.ts:468](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L468)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:460](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L460)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### ready()

> **ready**(`cb`): `void`

Defined in: [lib/form.ts:1053](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1053)

将在 form 完全装载完后执行，如果已经装载完则立即执行

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [lib/form.ts:436](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L436)

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

Defined in: [lib/form.ts:1102](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1102)

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

Defined in: [lib/form.ts:1190](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1190)

显示窗体

#### Returns

`Promise`\<`void`\>

***

### showDialog()

> **showDialog**(): `Promise`\<`string`\>

Defined in: [lib/form.ts:1215](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1215)

显示独占的窗体

#### Returns

`Promise`\<`string`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/form.ts:424](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L424)

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

Defined in: [lib/form.ts:1164](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L1164)

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

Defined in: [lib/form.ts:380](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L380)

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

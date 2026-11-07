[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractPanel

# Abstract Class: AbstractPanel

Defined in: lib/form/abstract-panel.ts:9

Panel 控件抽象类

## Extends

- `AbstractCommon`

## Constructors

### Constructor

> **new AbstractPanel**(): `AbstractPanel`

#### Returns

`AbstractPanel`

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

### qs

> **qs**: `Record`\<`string`, `string`\> = `{}`

Defined in: lib/form/abstract-panel.ts:73

当前的 nav（若有）传递过来的 qs

## Accessors

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

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: lib/form/abstract-panel.ts:81

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: lib/form/abstract-panel.ts:28

获取母窗体的 formHash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`fh`): `void`

Defined in: lib/form/abstract-panel.ts:33

设置母窗体的 formHash

##### Parameters

###### fh

`string`

##### Returns

`void`

***

### formHashData

#### Get Signature

> **get** **formHashData**(): `Record`\<`string`, `any`\>

Defined in: lib/form/abstract-panel.ts:38

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: lib/form/abstract-panel.ts:42

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

### panelId

#### Get Signature

> **get** **panelId**(): `string`

Defined in: lib/form/abstract-panel.ts:12

当前的 panel ID

##### Returns

`string`

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

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: lib/form/abstract-panel.ts:18

当前 panel 所在窗体的窗体对象，系统会在创建时重写本函数

##### Returns

[`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

***

### rootPanel

#### Get Signature

> **get** **rootPanel**(): [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

Defined in: lib/form/abstract-panel.ts:23

当前 panel 所在的 panel control 对象，系统会在创建时重写本函数

##### Returns

[`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

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

### clearQs()

> **clearQs**(): `void`

Defined in: lib/form/abstract-panel.ts:76

确定不再使用 qs 时可调用此方法清空，这样再次通过相同 qs 进入本 panel 依然会响应 qschange 事件

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:68

目窗体完成当前步骤

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: lib/form/abstract-panel.ts:57

母窗体进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:47

将母窗体的 form hash 回退

#### Returns

`Promise`\<`void`\>

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

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/base.ts:190

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onHide()

> **onHide**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:96

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:101

#### Returns

`void` \| `Promise`\<`void`\>

***

### onQsChange()

> **onQsChange**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:113

qs 变动时调用，如果只是用来做 qs 数据处理，建议用此方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onQsChangeShow()

> **onQsChangeShow**(`e`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:118

无论是 show 还是 qschange 都会触发，优先触发 show 或 qschange 事件本身，之后触发这个

#### Parameters

##### e

[`IAbstractPanelQsChangeShowEvent`](../interfaces/IAbstractPanelQsChangeShowEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:107

接收 send 传递过来的 data 数据（是 panel 控件的 send，不是 form 的 send）

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onShow()

> **onShow**(`e`): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:85

#### Parameters

##### e

[`IAbstractPanelShowEvent`](../interfaces/IAbstractPanelShowEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onShowed()

> **onShowed**(): `void` \| `Promise`\<`void`\>

Defined in: lib/form/abstract-panel.ts:90

panel 已经完全显示后所要执行的

#### Returns

`void` \| `Promise`\<`void`\>

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

### sendToRootPanel()

> **sendToRootPanel**(`data`): `void`

Defined in: lib/form/abstract-panel.ts:52

发送一段数据到自己这个 panel 控件，本质上也是调用的 panel 控件的 send 方法，主要用来实现发送给跳转后的 panel

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

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

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt?`): () => `void`

Defined in: lib/form/base.ts:122

监视变动

#### Type Parameters

##### T

`T` *extends* `AbstractPanel`

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

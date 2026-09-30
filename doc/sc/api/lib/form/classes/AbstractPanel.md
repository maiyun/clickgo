[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractPanel

# Abstract Class: AbstractPanel

Defined in: [lib/form.ts:474](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L474)

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

Defined in: [lib/form.ts:271](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L271)

当前视图内局部注册的应用组件

#### Inherited from

`AbstractCommon.components`

***

### qs

> **qs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [lib/form.ts:538](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L538)

当前的 nav（若有）传递过来的 qs

## Accessors

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

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:546](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L546)

当前窗体是否是焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formHash

#### Get Signature

> **get** **formHash**(): `string`

Defined in: [lib/form.ts:493](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L493)

获取母窗体的 formHash

##### Returns

`string`

#### Set Signature

> **set** **formHash**(`fh`): `void`

Defined in: [lib/form.ts:498](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L498)

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

Defined in: [lib/form.ts:503](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L503)

获取 form 的 formhash with data 值

##### Returns

`Record`\<`string`, `any`\>

#### Set Signature

> **set** **formHashData**(`v`): `void`

Defined in: [lib/form.ts:507](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L507)

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

### panelId

#### Get Signature

> **get** **panelId**(): `string`

Defined in: [lib/form.ts:477](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L477)

当前的 panel ID

##### Returns

`string`

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

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:483](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L483)

当前 panel 所在窗体的窗体对象，系统会在创建时重写本函数

##### Returns

[`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

***

### rootPanel

#### Get Signature

> **get** **rootPanel**(): [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:488](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L488)

当前 panel 所在的 panel control 对象，系统会在创建时重写本函数

##### Returns

[`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>

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

### clearQs()

> **clearQs**(): `void`

Defined in: [lib/form.ts:541](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L541)

确定不再使用 qs 时可调用此方法清空，这样再次通过相同 qs 进入本 panel 依然会响应 qschange 事件

#### Returns

`void`

***

### doneStep()

> **doneStep**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:533](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L533)

目窗体完成当前步骤

#### Returns

`Promise`\<`void`\>

***

### enterStep()

> **enterStep**(`list`): `Promise`\<`boolean`\>

Defined in: [lib/form.ts:522](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L522)

母窗体进入 form hash 为源的步进条

#### Parameters

##### list

`object`[]

#### Returns

`Promise`\<`boolean`\>

***

### formHashBack()

> **formHashBack**(): `Promise`\<`void`\>

Defined in: [lib/form.ts:512](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L512)

将母窗体的 form hash 回退

#### Returns

`Promise`\<`void`\>

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

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:447](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L447)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onHide()

> **onHide**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:561](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L561)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:566](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L566)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onQsChange()

> **onQsChange**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:578](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L578)

qs 变动时调用，如果只是用来做 qs 数据处理，建议用此方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onQsChangeShow()

> **onQsChangeShow**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:583](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L583)

无论是 show 还是 qschange 都会触发，优先触发 show 或 qschange 事件本身，之后触发这个

#### Parameters

##### e

[`IAbstractPanelQsChangeShowEvent`](../interfaces/IAbstractPanelQsChangeShowEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onReceive()

> **onReceive**(`data`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:572](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L572)

接收 send 传递过来的 data 数据（是 panel 控件的 send，不是 form 的 send）

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onShow()

> **onShow**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:550](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L550)

#### Parameters

##### e

[`IAbstractPanelShowEvent`](../interfaces/IAbstractPanelShowEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onShowed()

> **onShowed**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:555](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L555)

panel 已经完全显示后所要执行的

#### Returns

`void` \| `Promise`\<`void`\>

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

### sendToRootPanel()

> **sendToRootPanel**(`data`): `void`

Defined in: [lib/form.ts:517](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L517)

发送一段数据到自己这个 panel 控件，本质上也是调用的 panel 控件的 send 方法，主要用来实现发送给跳转后的 panel

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`void`

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

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt?`): () => `void`

Defined in: [lib/form.ts:379](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L379)

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

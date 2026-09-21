[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractComponent

# Abstract Class: AbstractComponent

Defined in: [lib/form.ts:594](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L594)

Form/Panel 内使用的应用局部组件抽象类

## Extends

- `AbstractCommon`

## Constructors

### Constructor

> **new AbstractComponent**(): `AbstractComponent`

#### Returns

`AbstractComponent`

#### Inherited from

`AbstractCommon.constructor`

## Properties

### components

> `readonly` **components**: `Record`\<`string`, () => `AbstractComponent`\> = `{}`

Defined in: [lib/form.ts:597](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L597)

当前组件内继续局部注册的应用组件

#### Overrides

`AbstractCommon.components`

***

### emits

> `readonly` **emits**: `Record`\<`string`, `null` \| ((`payload`) => `boolean`)\> = `{}`

Defined in: [lib/form.ts:660](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L660)

组件事件，由用户定义重写

***

### packageFiles

> `readonly` **packageFiles**: `Record`\<`string`, `Blob` \| `string`\> = `{}`

Defined in: [lib/form.ts:654](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L654)

组件内部文件，由系统重写

***

### props

> `readonly` **props**: `object` = `{}`

Defined in: [lib/form.ts:657](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L657)

组件参数，由用户定义重写

***

### slots

> `readonly` **slots**: `Record`\<`string`, () => `any`[]\> = `{}`

Defined in: [lib/form.ts:663](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L663)

组件的子插槽

## Accessors

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/form.ts:644](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L644)

应用组件动态 class 的隔离前缀

##### Returns

(`cla`) => `string`

#### Overrides

`AbstractCommon.classPrepend`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/form.ts:283](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L283)

当前控件的名字

##### Returns

`string`

#### Set Signature

> **set** **controlName**(`v`): `void`

Defined in: [lib/form.ts:287](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L287)

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

Defined in: [lib/form.ts:401](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L401)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

#### Inherited from

`AbstractCommon.element`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/form.ts:277](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L277)

当前文件在包内的路径

##### Returns

`string`

#### Inherited from

`AbstractCommon.filename`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/form.ts:600](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L600)

当前组件所在窗体的创建序号

##### Returns

`number`

***

### fl

#### Get Signature

> **get** **fl**(): (`key`, `data?`) => `string`

Defined in: [lib/form.ts:634](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L634)

获取宿主窗体语言内容

##### Returns

(`key`, `data?`) => `string`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:622](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L622)

当前组件是否跟随宿主窗体获得焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/form.ts:303](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L303)

当前的窗体 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.formId`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`) => `string`

Defined in: [lib/form.ts:627](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L627)

获取宿主 Form/Panel 的语言内容

##### Returns

(`key`, `data?`) => `string`

#### Overrides

`AbstractCommon.l`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/form.ts:329](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L329)

当前的语言

##### Returns

`string`

#### Inherited from

`AbstractCommon.locale`

***

### localeDirection

#### Get Signature

> **get** **localeDirection**(): `"ltr"` \| `"rtl"`

Defined in: [lib/form.ts:340](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L340)

当前语言的书写方向

##### Returns

`"ltr"` \| `"rtl"`

#### Inherited from

`AbstractCommon.localeDirection`

***

### localeTag

#### Get Signature

> **get** **localeTag**(): `string`

Defined in: [lib/form.ts:335](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L335)

当前语言的标准 HTML lang 标签

##### Returns

`string`

#### Inherited from

`AbstractCommon.localeTag`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/form.ts:408](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L408)

等待渲染

##### Returns

() => `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.nextTick`

***

### parent

#### Get Signature

> **get** **parent**(): `never`

Defined in: [lib/form.ts:711](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L711)

获取上层控件或组件

##### Returns

`never`

***

### parentByAccess

#### Get Signature

> **get** **parentByAccess**(): (`name`, `val`) => `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/form.ts:730](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L730)

根据 access 查询上层对象

##### Returns

(`name`, `val`) => `Record`\<`string`, `any`\> \| `null`

***

### parentByName

#### Get Signature

> **get** **parentByName**(): (`controlName`) => `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/form.ts:716](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L716)

根据 controlName 查询上层对象

##### Returns

(`controlName`) => `Record`\<`string`, `any`\> \| `null`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/form.ts:317](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L317)

当前文件的包内路径不以 / 结尾

##### Returns

`string`

#### Inherited from

`AbstractCommon.path`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/form.ts:323](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L323)

样式独占前缀

##### Returns

`string`

#### Inherited from

`AbstractCommon.prep`

***

### propArray

#### Get Signature

> **get** **propArray**(): (`name`) => `any`[]

Defined in: [lib/form.ts:701](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L701)

获取 props 中的 array 类型值

##### Returns

(`name`) => `any`[]

***

### propBoolean

#### Get Signature

> **get** **propBoolean**(): (`name`) => `boolean`

Defined in: [lib/form.ts:686](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L686)

获取 props 中的 boolean 类型值

##### Returns

(`name`) => `boolean`

***

### propInt

#### Get Signature

> **get** **propInt**(): (`name`) => `number`

Defined in: [lib/form.ts:696](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L696)

获取 props 中的 int 类型值

##### Returns

(`name`) => `number`

***

### propNumber

#### Get Signature

> **get** **propNumber**(): (`name`) => `number`

Defined in: [lib/form.ts:691](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L691)

获取 props 中的 number 类型值

##### Returns

(`name`) => `number`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

Defined in: [lib/form.ts:396](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L396)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & [`AbstractControl`](../../control/classes/AbstractControl.md) & `Record`\<`string`, `any`\>\>

#### Inherited from

`AbstractCommon.refs`

***

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:607](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L607)

##### Returns

[`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

***

### slotsAll

#### Get Signature

> **get** **slotsAll**(): (`name`) => `any`[]

Defined in: [lib/form.ts:666](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L666)

获取某插槽所有子项

##### Returns

(`name`) => `any`[]

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/form.ts:297](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L297)

当前的任务 ID

##### Returns

`string`

#### Inherited from

`AbstractCommon.taskId`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/form.ts:416](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L416)

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

### emit()

> **emit**(`name`, ...`v`): `void`

Defined in: [lib/form.ts:706](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L706)

向上触发组件事件

#### Parameters

##### name

`string`

##### v

...`any`[]

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:446](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L446)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeCreate`

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:454](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L454)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeMount`

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:466](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L466)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUnmount`

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:458](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L458)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onBeforeUpdate`

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:450](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L450)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:744](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L744)

组件挂载好后触发

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:470](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L470)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUnmounted`

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:462](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L462)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onUpdated`

***

### send()

> **send**(`fid`, `obj`): `void`

Defined in: [lib/form.ts:438](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L438)

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

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/form.ts:426](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L426)

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

Defined in: [lib/form.ts:382](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L382)

监视变动

#### Type Parameters

##### T

`T` *extends* `AbstractComponent`

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

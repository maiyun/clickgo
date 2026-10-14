[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / AbstractComponent

# Abstract Class: AbstractComponent

Defined in: [lib/form.ts:592](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L592)

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

Defined in: [lib/form.ts:595](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L595)

当前组件内继续局部注册的应用组件

#### Overrides

`AbstractCommon.components`

***

### emits

> `readonly` **emits**: `Record`\<`string`, `null` \| ((`payload`) => `boolean`)\> = `{}`

Defined in: [lib/form.ts:658](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L658)

组件事件，由用户定义重写

***

### packageFiles

> `readonly` **packageFiles**: `Record`\<`string`, `Blob` \| `string`\> = `{}`

Defined in: [lib/form.ts:652](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L652)

组件内部文件，由系统重写

***

### props

> `readonly` **props**: `object` = `{}`

Defined in: [lib/form.ts:655](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L655)

组件参数，由用户定义重写

***

### slots

> `readonly` **slots**: `Record`\<`string`, () => `any`[]\> = `{}`

Defined in: [lib/form.ts:661](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L661)

组件的子插槽

## Accessors

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/form.ts:642](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L642)

应用组件动态 class 的隔离前缀

##### Returns

(`cla`) => `string`

#### Overrides

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

Defined in: [lib/form.ts:598](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L598)

当前组件所在窗体的创建序号

##### Returns

`number`

***

### fl

#### Get Signature

> **get** **fl**(): (`key`, `data?`) => `string`

Defined in: [lib/form.ts:632](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L632)

获取宿主窗体语言内容

##### Returns

(`key`, `data?`) => `string`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/form.ts:620](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L620)

当前组件是否跟随宿主窗体获得焦点

##### Returns

`boolean`

#### Overrides

`AbstractCommon.formFocus`

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

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`) => `string`

Defined in: [lib/form.ts:625](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L625)

获取宿主 Form/Panel 的语言内容

##### Returns

(`key`, `data?`) => `string`

#### Overrides

`AbstractCommon.l`

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

### parent

#### Get Signature

> **get** **parent**(): `never`

Defined in: [lib/form.ts:709](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L709)

获取上层控件或组件

##### Returns

`never`

***

### parentByAccess

#### Get Signature

> **get** **parentByAccess**(): (`name`, `val`) => `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/form.ts:728](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L728)

根据 access 查询上层对象

##### Returns

(`name`, `val`) => `Record`\<`string`, `any`\> \| `null`

***

### parentByName

#### Get Signature

> **get** **parentByName**(): (`controlName`) => `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/form.ts:714](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L714)

根据 controlName 查询上层对象

##### Returns

(`controlName`) => `Record`\<`string`, `any`\> \| `null`

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

### propArray

#### Get Signature

> **get** **propArray**(): (`name`) => `any`[]

Defined in: [lib/form.ts:699](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L699)

获取 props 中的 array 类型值

##### Returns

(`name`) => `any`[]

***

### propBoolean

#### Get Signature

> **get** **propBoolean**(): (`name`) => `boolean`

Defined in: [lib/form.ts:684](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L684)

获取 props 中的 boolean 类型值

##### Returns

(`name`) => `boolean`

***

### propInt

#### Get Signature

> **get** **propInt**(): (`name`) => `number`

Defined in: [lib/form.ts:694](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L694)

获取 props 中的 int 类型值

##### Returns

(`name`) => `number`

***

### propNumber

#### Get Signature

> **get** **propNumber**(): (`name`) => `number`

Defined in: [lib/form.ts:689](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L689)

获取 props 中的 number 类型值

##### Returns

(`name`) => `number`

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

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:605](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L605)

##### Returns

[`AbstractForm`](AbstractForm.md) & `Record`\<`string`, `any`\>

***

### slotsAll

#### Get Signature

> **get** **slotsAll**(): (`name`) => `any`[]

Defined in: [lib/form.ts:664](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L664)

获取某插槽所有子项

##### Returns

(`name`) => `any`[]

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

### emit()

> **emit**(`name`, ...`v`): `void`

Defined in: [lib/form.ts:704](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L704)

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

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:448](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L448)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`AbstractCommon.onCreated`

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:742](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L742)

组件挂载好后触发

#### Returns

`void` \| `Promise`\<`void`\>

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

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt?`): () => `void`

Defined in: [lib/form.ts:380](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L380)

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

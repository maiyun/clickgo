[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / AbstractControl

# Abstract Class: AbstractControl

Defined in: [lib/control.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L63)

控件的抽象类

## Constructors

### Constructor

> **new AbstractControl**(): `AbstractControl`

#### Returns

`AbstractControl`

## Properties

### emits

> `readonly` **emits**: `Record`\<`string`, `null` \| ((`payload`) => `boolean`)\> = `{}`

Defined in: [lib/control.ts:315](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L315)

组件参数，由用户定义重写

***

### packageFiles

> `readonly` **packageFiles**: `Record`\<`string`, `Blob` \| `string`\> = `{}`

Defined in: [lib/control.ts:309](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L309)

组件内部文件，由系统重写

***

### props

> `readonly` **props**: `object` = `{}`

Defined in: [lib/control.ts:312](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L312)

组件参数，由用户定义重写

***

### slots

> `readonly` **slots**: `Record`\<`string`, () => `any`[]\> = `{}`

Defined in: [lib/control.ts:318](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L318)

组件的子插槽

## Accessors

### alignHComp

#### Get Signature

> **get** **alignHComp**(): `string` \| `undefined`

Defined in: [lib/control.ts:215](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L215)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### alignVComp

#### Get Signature

> **get** **alignVComp**(): `string` \| `undefined`

Defined in: [lib/control.ts:237](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L237)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/control.ts:201](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L201)

layout 中 :class 的转义

##### Returns

(`cla`) => `string`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/control.ts:80](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L80)

当前的控件名称

##### Returns

`string`

***

### element

#### Get Signature

> **get** **element**(): `HTMLElement`

Defined in: [lib/control.ts:110](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L110)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/control.ts:66](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L66)

当前文件在包内的路径

##### Returns

`string`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/control.ts:74](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L74)

当前的窗体创建的位数

##### Returns

`number`

***

### fl

#### Get Signature

> **get** **fl**(): (`key`, `data?`) => `string`

Defined in: [lib/control.ts:191](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L191)

获取窗体语言内容

##### Returns

(`key`, `data?`) => `string`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/control.ts:147](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L147)

当前窗体是否有焦点

##### Returns

`boolean`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/control.ts:92](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L92)

当前组件所在的窗体 ID

##### Returns

`string`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`) => `string`

Defined in: [lib/control.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L170)

获取语言内容

##### Returns

(`key`, `data?`) => `string`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/control.ts:152](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L152)

获取当前语言名

##### Returns

`string`

***

### localeDirection

#### Get Signature

> **get** **localeDirection**(): `"ltr"` \| `"rtl"`

Defined in: [lib/control.ts:163](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L163)

当前语言的书写方向

##### Returns

`"ltr"` \| `"rtl"`

***

### localeTag

#### Get Signature

> **get** **localeTag**(): `string`

Defined in: [lib/control.ts:158](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L158)

当前语言的标准 HTML lang 标签

##### Returns

`string`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/control.ts:280](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L280)

等待渲染

##### Returns

() => `Promise`\<`void`\>

***

### parent

#### Get Signature

> **get** **parent**(): `AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/control.ts:383](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L383)

获取上层控件

##### Returns

`AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

***

### parentByAccess

#### Get Signature

> **get** **parentByAccess**(): (`name`, `val`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:408](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L408)

根据 control access 查询上层控件

##### Returns

(`name`, `val`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### parentByName

#### Get Signature

> **get** **parentByName**(): (`controlName`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:390](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L390)

根据 control name 查询上层控件

##### Returns

(`controlName`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/control.ts:98](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L98)

当前控件所在运行窗体的包内路径不以 / 结尾

##### Returns

`string`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/control.ts:104](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L104)

样式独占前缀

##### Returns

`string`

***

### propArray

#### Get Signature

> **get** **propArray**(): (`name`) => `any`[]

Defined in: [lib/control.ts:365](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L365)

获取 props 中的 array 类型的值

##### Returns

(`name`) => `any`[]

***

### propBoolean

#### Get Signature

> **get** **propBoolean**(): (`name`) => `boolean`

Defined in: [lib/control.ts:344](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L344)

获取 props 中的 boolean 类型的值

##### Returns

(`name`) => `boolean`

***

### propInt

#### Get Signature

> **get** **propInt**(): (`name`) => `number`

Defined in: [lib/control.ts:358](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L358)

获取 props 中的 int 类型的值

##### Returns

(`name`) => `number`

***

### propNumber

#### Get Signature

> **get** **propNumber**(): (`name`) => `number`

Defined in: [lib/control.ts:351](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L351)

获取 props 中的 number 类型的值

##### Returns

(`name`) => `number`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & `AbstractControl` & `Record`\<`string`, `any`\>\>

Defined in: [lib/control.ts:273](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L273)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & `AbstractControl` & `Record`\<`string`, `any`\>\>

***

### rootControl

#### Get Signature

> **get** **rootControl**(): `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:140](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L140)

当前组件如果在开发控件层面被包裹了，则可以获取到包裹他的组件对象

##### Returns

`AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/control.ts:121](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L121)

当前控件所在窗体的窗体对象

##### Returns

[`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

***

### slotsAll

#### Get Signature

> **get** **slotsAll**(): (`name`) => `any`[]

Defined in: [lib/control.ts:321](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L321)

获取某插槽所有子类

##### Returns

(`name`) => `any`[]

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/control.ts:86](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L86)

当前组件所在的任务 ID

##### Returns

`string`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/control.ts:288](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L288)

判断当前事件可否执行

#### Parameters

##### e

`PointerEvent` \| `KeyboardEvent`

鼠标、触摸、键盘事件

#### Returns

`boolean`

***

### emit()

> **emit**(`name`, ...`v`): `void`

Defined in: [lib/control.ts:376](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L376)

向上反应事件

#### Parameters

##### name

`string`

事件名

##### v

...`any`

事件值

#### Returns

`void`

***

### onBeforeCreate()

> **onBeforeCreate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:429](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L429)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:437](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L437)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:454](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L454)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:446](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L446)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:433](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L433)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:442](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L442)

控件挂载好后触发

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:458](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L458)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:450](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L450)

#### Returns

`void` \| `Promise`\<`void`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/control.ts:299](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L299)

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

***

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt?`): () => `void`

Defined in: [lib/control.ts:259](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L259)

监视变动

#### Type Parameters

##### T

`T` *extends* `AbstractControl`

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

##### TR

`TR`

#### Parameters

##### name

`TK` \| (() => `TR`)

监视的属性或 prop 值

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

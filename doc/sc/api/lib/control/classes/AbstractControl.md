[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / AbstractControl

# Abstract Class: AbstractControl

Defined in: [lib/control.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L63)

窗体的抽象类

## Constructors

### Constructor

> **new AbstractControl**(): `AbstractControl`

#### Returns

`AbstractControl`

## Properties

### emits

> `readonly` **emits**: `Record`\<`string`, `null` \| ((`payload`) => `boolean`)\> = `{}`

Defined in: [lib/control.ts:299](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L299)

组件参数，由用户定义重写

***

### packageFiles

> `readonly` **packageFiles**: `Record`\<`string`, `Blob` \| `string`\> = `{}`

Defined in: [lib/control.ts:293](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L293)

组件内部文件，由系统重写

***

### props

> `readonly` **props**: `object` = `{}`

Defined in: [lib/control.ts:296](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L296)

组件参数，由用户定义重写

***

### slots

> `readonly` **slots**: `Record`\<`string`, () => `any`[]\> = `{}`

Defined in: [lib/control.ts:302](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L302)

组件的子插槽

## Accessors

### alignHComp

#### Get Signature

> **get** **alignHComp**(): `string` \| `undefined`

Defined in: [lib/control.ts:204](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L204)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### alignVComp

#### Get Signature

> **get** **alignVComp**(): `string` \| `undefined`

Defined in: [lib/control.ts:221](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L221)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/control.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L190)

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

Defined in: [lib/control.ts:180](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L180)

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

Defined in: [lib/control.ts:160](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L160)

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

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/control.ts:264](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L264)

等待渲染

##### Returns

() => `Promise`\<`void`\>

***

### parent

#### Get Signature

> **get** **parent**(): `AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/control.ts:367](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L367)

获取上层控件

##### Returns

`AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

***

### parentByAccess

#### Get Signature

> **get** **parentByAccess**(): (`name`, `val`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:392](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L392)

根据 control access 查询上层控件

##### Returns

(`name`, `val`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### parentByName

#### Get Signature

> **get** **parentByName**(): (`controlName`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:374](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L374)

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

Defined in: [lib/control.ts:349](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L349)

获取 props 中的 array 类型的值

##### Returns

(`name`) => `any`[]

***

### propBoolean

#### Get Signature

> **get** **propBoolean**(): (`name`) => `boolean`

Defined in: [lib/control.ts:328](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L328)

获取 props 中的 boolean 类型的值

##### Returns

(`name`) => `boolean`

***

### propInt

#### Get Signature

> **get** **propInt**(): (`name`) => `number`

Defined in: [lib/control.ts:342](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L342)

获取 props 中的 int 类型的值

##### Returns

(`name`) => `number`

***

### propNumber

#### Get Signature

> **get** **propNumber**(): (`name`) => `number`

Defined in: [lib/control.ts:335](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L335)

获取 props 中的 number 类型的值

##### Returns

(`name`) => `number`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & `AbstractControl` & `Record`\<`string`, `any`\>\>

Defined in: [lib/control.ts:257](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L257)

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

Defined in: [lib/control.ts:305](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L305)

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

Defined in: [lib/control.ts:272](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L272)

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

Defined in: [lib/control.ts:360](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L360)

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

Defined in: [lib/control.ts:413](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L413)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:421](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L421)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:438](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L438)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:430](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L430)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:417](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L417)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:426](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L426)

控件挂载好后触发

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:442](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L442)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:434](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L434)

#### Returns

`void` \| `Promise`\<`void`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/control.ts:283](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L283)

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

Defined in: [lib/control.ts:243](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L243)

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

[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/control](../index.md) / AbstractControl

# Abstract Class: AbstractControl

Defined in: [lib/control.ts:40](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L40)

窗体的抽象类

## Constructors

### Constructor

> **new AbstractControl**(): `AbstractControl`

#### Returns

`AbstractControl`

## Properties

### emits

> `readonly` **emits**: `Record`\<`string`, `null` \| (`payload`) => `boolean`\> = `{}`

Defined in: [lib/control.ts:276](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L276)

组件参数，由用户定义重写

***

### packageFiles

> `readonly` **packageFiles**: `Record`\<`string`, `Blob` \| `string`\> = `{}`

Defined in: [lib/control.ts:270](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L270)

组件内部文件，由系统重写

***

### props

> `readonly` **props**: `object` = `{}`

Defined in: [lib/control.ts:273](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L273)

组件参数，由用户定义重写

***

### slots

> `readonly` **slots**: `Record`\<`string`, () => `any`[]\> = `{}`

Defined in: [lib/control.ts:279](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L279)

组件的子插槽

## Accessors

### alignHComp

#### Get Signature

> **get** **alignHComp**(): `string` \| `undefined`

Defined in: [lib/control.ts:181](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L181)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### alignVComp

#### Get Signature

> **get** **alignVComp**(): `string` \| `undefined`

Defined in: [lib/control.ts:198](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L198)

获取 alignH 的 css 属性模式，请确保 props.alignH 存在

##### Returns

`string` \| `undefined`

***

### classPrepend

#### Get Signature

> **get** **classPrepend**(): (`cla`) => `string`

Defined in: [lib/control.ts:167](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L167)

layout 中 :class 的转义

##### Returns

> (`cla`): `string`

###### Parameters

###### cla

`any`

###### Returns

`string`

***

### controlName

#### Get Signature

> **get** **controlName**(): `string`

Defined in: [lib/control.ts:57](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L57)

当前的控件名称

##### Returns

`string`

***

### element

#### Get Signature

> **get** **element**(): `HTMLElement`

Defined in: [lib/control.ts:87](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L87)

获取当前的 HTML DOM

##### Returns

`HTMLElement`

***

### filename

#### Get Signature

> **get** **filename**(): `string`

Defined in: [lib/control.ts:43](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L43)

当前文件在包内的路径

##### Returns

`string`

***

### findex

#### Get Signature

> **get** **findex**(): `number`

Defined in: [lib/control.ts:51](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L51)

当前的窗体创建的位数

##### Returns

`number`

***

### fl

#### Get Signature

> **get** **fl**(): (`key`, `data?`) => `string`

Defined in: [lib/control.ts:157](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L157)

获取窗体语言内容

##### Returns

> (`key`, `data?`): `string`

###### Parameters

###### key

`string`

###### data?

`string`[]

###### Returns

`string`

***

### formFocus

#### Get Signature

> **get** **formFocus**(): `boolean`

Defined in: [lib/control.ts:124](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L124)

当前窗体是否有焦点

##### Returns

`boolean`

***

### formId

#### Get Signature

> **get** **formId**(): `string`

Defined in: [lib/control.ts:69](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L69)

当前组件所在的窗体 ID

##### Returns

`string`

***

### l

#### Get Signature

> **get** **l**(): (`key`, `data?`) => `string`

Defined in: [lib/control.ts:137](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L137)

获取语言内容

##### Returns

> (`key`, `data?`): `string`

###### Parameters

###### key

`string`

###### data?

`string`[]

###### Returns

`string`

***

### locale

#### Get Signature

> **get** **locale**(): `string`

Defined in: [lib/control.ts:129](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L129)

获取当前语言名

##### Returns

`string`

***

### nextTick

#### Get Signature

> **get** **nextTick**(): () => `Promise`\<`void`\>

Defined in: [lib/control.ts:241](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L241)

等待渲染

##### Returns

> (): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

***

### parent

#### Get Signature

> **get** **parent**(): `AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/control.ts:344](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L344)

获取上层控件

##### Returns

`AbstractControl` & [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

***

### parentByAccess

#### Get Signature

> **get** **parentByAccess**(): (`name`, `val`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:369](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L369)

根据 control access 查询上层控件

##### Returns

> (`name`, `val`): `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

###### Parameters

###### name

`string`

###### val

`string`

###### Returns

`AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### parentByName

#### Get Signature

> **get** **parentByName**(): (`controlName`) => `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:351](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L351)

根据 control name 查询上层控件

##### Returns

> (`controlName`): `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

###### Parameters

###### controlName

`string`

###### Returns

`AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [lib/control.ts:75](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L75)

当前控件所在运行窗体的包内路径不以 / 结尾

##### Returns

`string`

***

### prep

#### Get Signature

> **get** **prep**(): `string`

Defined in: [lib/control.ts:81](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L81)

样式独占前缀

##### Returns

`string`

***

### propArray

#### Get Signature

> **get** **propArray**(): (`name`) => `any`[]

Defined in: [lib/control.ts:326](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L326)

获取 props 中的 array 类型的值

##### Returns

> (`name`): `any`[]

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`any`[]

***

### propBoolean

#### Get Signature

> **get** **propBoolean**(): (`name`) => `boolean`

Defined in: [lib/control.ts:305](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L305)

获取 props 中的 boolean 类型的值

##### Returns

> (`name`): `boolean`

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`boolean`

***

### propInt

#### Get Signature

> **get** **propInt**(): (`name`) => `number`

Defined in: [lib/control.ts:319](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L319)

获取 props 中的 int 类型的值

##### Returns

> (`name`): `number`

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`number`

***

### propNumber

#### Get Signature

> **get** **propNumber**(): (`name`) => `number`

Defined in: [lib/control.ts:312](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L312)

获取 props 中的 number 类型的值

##### Returns

> (`name`): `number`

###### Parameters

###### name

keyof `this`\[`"props"`\]

###### Returns

`number`

***

### refs

#### Get Signature

> **get** **refs**(): `Record`\<`string`, `HTMLElement` & `AbstractControl` & `Record`\<`string`, `any`\>\>

Defined in: [lib/control.ts:234](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L234)

获取 refs 情况

##### Returns

`Record`\<`string`, `HTMLElement` & `AbstractControl` & `Record`\<`string`, `any`\>\>

***

### rootControl

#### Get Signature

> **get** **rootControl**(): `AbstractControl` & `Record`\<`string`, `any`\> \| `null`

Defined in: [lib/control.ts:117](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L117)

当前组件如果在开发控件层面被包裹了，则可以获取到包裹他的组件对象

##### Returns

`AbstractControl` & `Record`\<`string`, `any`\> \| `null`

***

### rootForm

#### Get Signature

> **get** **rootForm**(): [`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

Defined in: [lib/control.ts:98](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L98)

当前控件所在窗体的窗体对象

##### Returns

[`AbstractForm`](../../form/classes/AbstractForm.md) & `Record`\<`string`, `any`\>

***

### slotsAll

#### Get Signature

> **get** **slotsAll**(): (`name`) => `any`[]

Defined in: [lib/control.ts:282](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L282)

获取某插槽所有子类

##### Returns

> (`name`): `any`[]

###### Parameters

###### name

`string`

###### Returns

`any`[]

***

### taskId

#### Get Signature

> **get** **taskId**(): `string`

Defined in: [lib/control.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L63)

当前组件所在的任务 ID

##### Returns

`string`

## Methods

### allowEvent()

> **allowEvent**(`e`): `boolean`

Defined in: [lib/control.ts:249](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L249)

判断当前事件可否执行

#### Parameters

##### e

鼠标、触摸、键盘事件

`PointerEvent` | `KeyboardEvent`

#### Returns

`boolean`

***

### emit()

> **emit**(`name`, ...`v`): `void`

Defined in: [lib/control.ts:337](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L337)

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

Defined in: [lib/control.ts:390](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L390)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeMount()

> **onBeforeMount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:398](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L398)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUnmount()

> **onBeforeUnmount**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:415](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L415)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeUpdate()

> **onBeforeUpdate**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:407](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L407)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onCreated()

> **onCreated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:394](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L394)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMounted()

> **onMounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:403](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L403)

控件挂载好后触发

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUnmounted()

> **onUnmounted**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:419](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L419)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onUpdated()

> **onUpdated**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/control.ts:411](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L411)

#### Returns

`void` \| `Promise`\<`void`\>

***

### trigger()

> **trigger**(`name`, `param1?`, `param2?`): `Promise`\<`void`\>

Defined in: [lib/control.ts:260](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L260)

触发系统方法

#### Parameters

##### name

[`TGlobalEvent`](../../core/type-aliases/TGlobalEvent.md)

方法名

##### param1?

参数1

`string` | `boolean` | `Error`

##### param2?

`string` = `''`

参数2

#### Returns

`Promise`\<`void`\>

***

### watch()

> **watch**\<`T`, `TK`, `TR`\>(`name`, `cb`, `opt?`): () => `void`

Defined in: [lib/control.ts:220](https://github.com/maiyun/clickgo/blob/master/dist/lib/control.ts#L220)

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

监视的属性或 prop 值

`TK` | () => `TR`

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

> (): `void`

##### Returns

`void`

[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / AbstractBoot

# Abstract Class: AbstractBoot

Defined in: [dist/clickgo.ts:161](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L161)

全局类

## Constructors

### Constructor

> **new AbstractBoot**(`opt`): `AbstractBoot`

Defined in: [dist/clickgo.ts:181](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L181)

#### Parameters

##### opt

###### debug?

`boolean`

#### Returns

`AbstractBoot`

## Properties

### \_sysId

> `protected` **\_sysId**: `string` = `''`

Defined in: [dist/clickgo.ts:167](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L167)

切勿传给 App

## Methods

### isDebug()

> **isDebug**(): `boolean`

Defined in: [dist/clickgo.ts:177](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L177)

判断当前是否是 debug 模式

#### Returns

`boolean`

***

### main()

> `abstract` **main**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:190](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L190)

入口方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:205](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L205)

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* [`IConfig`](../../lib/core/interfaces/IConfig.md)

##### TK

`TK` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### n

`TK`

##### v

`T`\[`TK`\]

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()

> **onError**(`taskId`, `formId`, `error`, `info`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:193](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L193)

全局错误事件

#### Parameters

##### taskId

`string`

##### formId

`string`

##### error

`Error`

##### info

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onFormBlurred()

> **onFormBlurred**(`taskId`, `formId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:261](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L261)

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

Defined in: [dist/clickgo.ts:211](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L211)

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

Defined in: [dist/clickgo.ts:267](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L267)

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

Defined in: [dist/clickgo.ts:255](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L255)

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

Defined in: [dist/clickgo.ts:279](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L279)

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

Defined in: [dist/clickgo.ts:231](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L231)

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

Defined in: [dist/clickgo.ts:219](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L219)

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

Defined in: [dist/clickgo.ts:249](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L249)

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

Defined in: [dist/clickgo.ts:273](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L273)

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

Defined in: [dist/clickgo.ts:243](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L243)

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

Defined in: [dist/clickgo.ts:237](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L237)

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

Defined in: [dist/clickgo.ts:225](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L225)

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

Defined in: [dist/clickgo.ts:305](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L305)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:311](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L311)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:317](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L317)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:299](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L299)

launcher 文件夹名称修改事件

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRuntimeFileLoad()

> **onRuntimeFileLoad**(`url`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:323](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L323)

环境文件准备加载时的事件

#### Parameters

##### url

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRuntimeFileLoaded()

> **onRuntimeFileLoaded**(`url`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:329](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L329)

环境文件加载完成的事件

#### Parameters

##### url

`string`

##### state

`number`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:199](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L199)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:293](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L293)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/clickgo.ts:287](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L287)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### setSysId()

> **setSysId**(`sysId`): `void`

Defined in: [dist/clickgo.ts:169](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L169)

#### Parameters

##### sysId

`string`

#### Returns

`void`

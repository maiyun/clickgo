[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / AbstractBoot

# Abstract Class: AbstractBoot

Defined in: [clickgo.ts:164](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L164)

全局类

## Constructors

### Constructor

> **new AbstractBoot**(`opt?`): `AbstractBoot`

Defined in: [clickgo.ts:184](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L184)

#### Parameters

##### opt?

###### debug?

`boolean`

#### Returns

`AbstractBoot`

## Properties

### \_sysId

> `protected` **\_sysId**: `string` = `''`

Defined in: [clickgo.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L170)

切勿传给 App

## Methods

### isDebug()

> **isDebug**(): `boolean`

Defined in: [clickgo.ts:180](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L180)

判断当前是否是 debug 模式

#### Returns

`boolean`

***

### main()

> `abstract` **main**(): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:193](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L193)

入口方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:208](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L208)

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

Defined in: [clickgo.ts:196](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L196)

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

Defined in: [clickgo.ts:264](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L264)

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

Defined in: [clickgo.ts:214](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L214)

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

Defined in: [clickgo.ts:270](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L270)

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

Defined in: [clickgo.ts:258](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L258)

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

Defined in: [clickgo.ts:282](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L282)

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

Defined in: [clickgo.ts:234](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L234)

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

Defined in: [clickgo.ts:222](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L222)

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

Defined in: [clickgo.ts:252](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L252)

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

Defined in: [clickgo.ts:276](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L276)

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

Defined in: [clickgo.ts:246](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L246)

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

Defined in: [clickgo.ts:240](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L240)

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

Defined in: [clickgo.ts:228](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L228)

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

Defined in: [clickgo.ts:308](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L308)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:314](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L314)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:320](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L320)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:302](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L302)

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

Defined in: [clickgo.ts:326](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L326)

环境文件准备加载时的事件

#### Parameters

##### url

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRuntimeFileLoaded()

> **onRuntimeFileLoaded**(`url`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:332](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L332)

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

Defined in: [clickgo.ts:202](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L202)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:296](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L296)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:290](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L290)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### setSysId()

> **setSysId**(`sysId`): `void`

Defined in: [clickgo.ts:172](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L172)

#### Parameters

##### sysId

`string`

#### Returns

`void`

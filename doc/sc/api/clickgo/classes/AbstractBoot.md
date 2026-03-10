[**Documents for clickgo**](../../index.md)

***

[Documents for clickgo](../../index.md) / [clickgo](../index.md) / AbstractBoot

# Abstract Class: AbstractBoot

Defined in: [clickgo.ts:165](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L165)

全局类

## Constructors

### Constructor

> **new AbstractBoot**(`opt?`): `AbstractBoot`

Defined in: [clickgo.ts:185](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L185)

#### Parameters

##### opt?

###### debug?

`boolean`

#### Returns

`AbstractBoot`

## Properties

### \_sysId

> `protected` **\_sysId**: `string` = `''`

Defined in: [clickgo.ts:171](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L171)

切勿传给 App

## Methods

### isDebug()

> **isDebug**(): `boolean`

Defined in: [clickgo.ts:181](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L181)

判断当前是否是 debug 模式

#### Returns

`boolean`

***

### main()

> `abstract` **main**(): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:194](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L194)

入口方法

#### Returns

`void` \| `Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:209](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L209)

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

Defined in: [clickgo.ts:197](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L197)

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

Defined in: [clickgo.ts:265](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L265)

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

Defined in: [clickgo.ts:215](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L215)

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

Defined in: [clickgo.ts:271](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L271)

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

Defined in: [clickgo.ts:259](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L259)

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

Defined in: [clickgo.ts:283](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L283)

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

Defined in: [clickgo.ts:235](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L235)

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

Defined in: [clickgo.ts:223](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L223)

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

Defined in: [clickgo.ts:253](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L253)

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

Defined in: [clickgo.ts:277](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L277)

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

Defined in: [clickgo.ts:247](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L247)

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

Defined in: [clickgo.ts:241](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L241)

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

Defined in: [clickgo.ts:229](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L229)

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

Defined in: [clickgo.ts:309](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L309)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:315](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L315)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:321](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L321)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:303](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L303)

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

Defined in: [clickgo.ts:327](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L327)

环境文件准备加载时的事件

#### Parameters

##### url

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRuntimeFileLoaded()

> **onRuntimeFileLoaded**(`url`, `state`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:333](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L333)

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

Defined in: [clickgo.ts:203](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L203)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:297](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L297)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [clickgo.ts:291](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L291)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### setSysId()

> **setSysId**(`sysId`): `void`

Defined in: [clickgo.ts:173](https://github.com/maiyun/clickgo/blob/master/dist/clickgo.ts#L173)

#### Parameters

##### sysId

`string`

#### Returns

`void`

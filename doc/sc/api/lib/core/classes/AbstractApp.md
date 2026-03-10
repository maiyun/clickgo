[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / AbstractApp

# Abstract Class: AbstractApp

Defined in: [lib/core.ts:57](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L57)

App 抽象类

## Constructors

### Constructor

> **new AbstractApp**(): `AbstractApp`

#### Returns

`AbstractApp`

## Properties

### filename

> **filename**: `string` = `''`

Defined in: [lib/core.ts:60](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L60)

当前 js 文件在包内的完整路径

***

### taskId

> **taskId**: `string` = `''`

Defined in: [lib/core.ts:63](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L63)

系统会自动设置本项

## Methods

### main()

> `abstract` **main**(`data`): `Promise`\<`void`\>

Defined in: [lib/core.ts:66](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L66)

App 的入口文件

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:89](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L89)

系统配置变更事件

#### Type Parameters

##### T

`T` *extends* [`IConfig`](../interfaces/IConfig.md)

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

Defined in: [lib/core.ts:77](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L77)

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

Defined in: [lib/core.ts:145](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L145)

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

Defined in: [lib/core.ts:95](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L95)

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

Defined in: [lib/core.ts:151](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L151)

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

Defined in: [lib/core.ts:139](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L139)

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

Defined in: [lib/core.ts:163](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L163)

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

Defined in: [lib/core.ts:115](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L115)

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

Defined in: [lib/core.ts:103](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L103)

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

Defined in: [lib/core.ts:133](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L133)

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

Defined in: [lib/core.ts:157](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L157)

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

Defined in: [lib/core.ts:127](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L127)

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

Defined in: [lib/core.ts:121](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L121)

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

Defined in: [lib/core.ts:109](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L109)

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

Defined in: [lib/core.ts:189](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L189)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:195](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L195)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:201](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L201)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:183](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L183)

launcher 文件夹名称修改事件

#### Parameters

##### id

`string`

##### name

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onScreenResize()

> **onScreenResize**(): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:83](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L83)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:177](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L177)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [lib/core.ts:171](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L171)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### run()

> **run**(`form`): `Promise`\<`void`\>

Defined in: [lib/core.ts:72](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L72)

以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败

#### Parameters

##### form

[`AbstractForm`](../../form/classes/AbstractForm.md)

窗体对象

#### Returns

`Promise`\<`void`\>

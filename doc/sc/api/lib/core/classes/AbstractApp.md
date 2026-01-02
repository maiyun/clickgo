[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/core](../index.md) / AbstractApp

# Abstract Class: AbstractApp

Defined in: [dist/lib/core.ts:56](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L56)

App 抽象类

## Constructors

### Constructor

> **new AbstractApp**(): `AbstractApp`

#### Returns

`AbstractApp`

## Properties

### filename

> **filename**: `string` = `''`

Defined in: [dist/lib/core.ts:59](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L59)

当前 js 文件在包内的完整路径

***

### taskId

> **taskId**: `string` = `''`

Defined in: [dist/lib/core.ts:62](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L62)

系统会自动设置本项

## Methods

### main()

> `abstract` **main**(`data`): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:65](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L65)

App 的入口文件

#### Parameters

##### data

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### onConfigChanged()

> **onConfigChanged**\<`T`, `TK`\>(`n`, `v`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:88](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L88)

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

Defined in: [dist/lib/core.ts:76](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L76)

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

Defined in: [dist/lib/core.ts:144](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L144)

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

Defined in: [dist/lib/core.ts:94](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L94)

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

Defined in: [dist/lib/core.ts:150](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L150)

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

Defined in: [dist/lib/core.ts:138](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L138)

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

Defined in: [dist/lib/core.ts:162](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L162)

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

Defined in: [dist/lib/core.ts:114](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L114)

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

Defined in: [dist/lib/core.ts:102](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L102)

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

Defined in: [dist/lib/core.ts:132](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L132)

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

Defined in: [dist/lib/core.ts:156](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L156)

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

Defined in: [dist/lib/core.ts:126](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L126)

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

Defined in: [dist/lib/core.ts:120](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L120)

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

Defined in: [dist/lib/core.ts:108](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L108)

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

Defined in: [dist/lib/core.ts:188](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L188)

location hash 改变事件

#### Parameters

##### hash

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeydown()

> **onKeydown**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:194](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L194)

键盘按下事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onKeyup()

> **onKeyup**(`e`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:200](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L200)

键盘弹起事件

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLauncherFolderNameChanged()

> **onLauncherFolderNameChanged**(`id`, `name`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:182](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L182)

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

Defined in: [dist/lib/core.ts:82](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L82)

屏幕大小改变事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskEnded()

> **onTaskEnded**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:176](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L176)

任务结束事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTaskStarted()

> **onTaskStarted**(`taskId`): `void` \| `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:170](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L170)

任务开始事件

#### Parameters

##### taskId

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### run()

> **run**(`form`): `Promise`\<`void`\>

Defined in: [dist/lib/core.ts:71](https://github.com/maiyun/clickgo/blob/master/dist/lib/core.ts#L71)

以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败

#### Parameters

##### form

[`AbstractForm`](../../form/classes/AbstractForm.md)

窗体对象

#### Returns

`Promise`\<`void`\>

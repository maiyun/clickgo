[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [lib/form/types.ts:113](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L113)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult?**: `boolean`

Defined in: [lib/form/types.ts:121](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L121)

点击按钮后是否自动将按钮文本写入 dialogResult，默认 true

***

### buttons?

> `optional` **buttons?**: `string`[]

Defined in: [lib/form/types.ts:119](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L119)

底部按钮文本列表，默认使用当前语言的确定按钮文本

***

### content

> **content**: `string`

Defined in: [lib/form/types.ts:117](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L117)

dialog 内容，支持直接传布局字符串

***

### data?

> `optional` **data?**: `Record`\<`string`, `any`\>

Defined in: [lib/form/types.ts:135](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L135)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction?**: `"v"` \| `"h"`

Defined in: [lib/form/types.ts:124](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L124)

dialog 控件内容布局方向，h 为横向，v 为纵向

***

### gutter?

> `optional` **gutter?**: `string` \| `number`

Defined in: [lib/form/types.ts:126](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L126)

dialog 控件内容区项目间距，会透传给 dialog 控件

***

### height?

> `optional` **height?**: `string` \| `number`

Defined in: [lib/form/types.ts:130](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L130)

dialog 控件高度，传数字时为像素值，传 fill 时代表填充可用高度

***

### methods?

> `optional` **methods?**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [lib/form/types.ts:137](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L137)

传值，需要用 methods.x 读取

***

### onMounted?

> `optional` **onMounted?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/form/types.ts:157](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L157)

窗体挂载完成事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### padding?

> `optional` **padding?**: `string` \| `boolean`

Defined in: [lib/form/types.ts:132](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L132)

dialog 控件内容区是否显示内边距，默认表现与控件自身一致

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/form/types.ts:141](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L141)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form/types.ts:148](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L148)

点击按钮触发事件，不能用 Promise

#### Parameters

##### this

[`AbstractForm`](../classes/AbstractForm.md) & `object`

##### e

[`IFormDialogSelectEvent`](IFormDialogSelectEvent.md)

数据事件

##### button

`string`

按钮的文本

#### Returns

`void`

***

### style?

> `optional` **style?**: `string`

Defined in: [lib/form/types.ts:139](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L139)

样式表

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form/types.ts:115](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L115)

dialog 窗体标题，不传则使用默认标题 dialog

***

### width?

> `optional` **width?**: `string` \| `number`

Defined in: [lib/form/types.ts:128](https://github.com/maiyun/clickgo/blob/master/dist/lib/form/types.ts#L128)

dialog 控件宽度，传数字时为像素值，传 fill 时代表填充可用宽度

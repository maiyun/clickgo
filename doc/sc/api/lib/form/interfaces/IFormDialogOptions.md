[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [lib/form.ts:4960](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4960)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult?**: `boolean`

Defined in: [lib/form.ts:4968](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4968)

点击按钮后是否自动将按钮文本写入 dialogResult，默认 true

***

### buttons?

> `optional` **buttons?**: `string`[]

Defined in: [lib/form.ts:4966](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4966)

底部按钮文本列表，默认使用当前语言的确定按钮文本

***

### content

> **content**: `string`

Defined in: [lib/form.ts:4964](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4964)

dialog 内容，支持直接传布局字符串

***

### data?

> `optional` **data?**: `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:4982](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4982)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction?**: `"v"` \| `"h"`

Defined in: [lib/form.ts:4971](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4971)

dialog 控件内容布局方向，h 为横向，v 为纵向

***

### gutter?

> `optional` **gutter?**: `string` \| `number`

Defined in: [lib/form.ts:4973](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4973)

dialog 控件内容区项目间距，会透传给 dialog 控件

***

### height?

> `optional` **height?**: `string` \| `number`

Defined in: [lib/form.ts:4977](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4977)

dialog 控件高度，传数字时为像素值，传 fill 时代表填充可用高度

***

### methods?

> `optional` **methods?**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [lib/form.ts:4984](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4984)

传值，需要用 methods.x 读取

***

### onMounted?

> `optional` **onMounted?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:5004](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L5004)

窗体挂载完成事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### padding?

> `optional` **padding?**: `string` \| `boolean`

Defined in: [lib/form.ts:4979](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4979)

dialog 控件内容区是否显示内边距，默认表现与控件自身一致

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/form.ts:4988](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4988)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form.ts:4995](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4995)

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

Defined in: [lib/form.ts:4986](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4986)

样式表

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form.ts:4962](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4962)

dialog 窗体标题，不传则使用默认标题 dialog

***

### width?

> `optional` **width?**: `string` \| `number`

Defined in: [lib/form.ts:4975](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4975)

dialog 控件宽度，传数字时为像素值，传 fill 时代表填充可用宽度

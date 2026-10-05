[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [lib/form.ts:4943](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4943)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult?**: `boolean`

Defined in: [lib/form.ts:4951](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4951)

点击按钮后是否自动将按钮文本写入 dialogResult，默认 true

***

### buttons?

> `optional` **buttons?**: `string`[]

Defined in: [lib/form.ts:4949](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4949)

底部按钮文本列表，默认使用当前语言的确定按钮文本

***

### content

> **content**: `string`

Defined in: [lib/form.ts:4947](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4947)

dialog 内容，支持直接传布局字符串

***

### data?

> `optional` **data?**: `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:4965](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4965)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction?**: `"v"` \| `"h"`

Defined in: [lib/form.ts:4954](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4954)

dialog 控件内容布局方向，h 为横向，v 为纵向

***

### gutter?

> `optional` **gutter?**: `string` \| `number`

Defined in: [lib/form.ts:4956](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4956)

dialog 控件内容区项目间距，会透传给 dialog 控件

***

### height?

> `optional` **height?**: `string` \| `number`

Defined in: [lib/form.ts:4960](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4960)

dialog 控件高度，传数字时为像素值，传 fill 时代表填充可用高度

***

### methods?

> `optional` **methods?**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [lib/form.ts:4967](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4967)

传值，需要用 methods.x 读取

***

### onMounted?

> `optional` **onMounted?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:4987](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4987)

窗体挂载完成事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### padding?

> `optional` **padding?**: `string` \| `boolean`

Defined in: [lib/form.ts:4962](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4962)

dialog 控件内容区是否显示内边距，默认表现与控件自身一致

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/form.ts:4971](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4971)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form.ts:4978](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4978)

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

Defined in: [lib/form.ts:4969](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4969)

样式表

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form.ts:4945](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4945)

dialog 窗体标题，不传则使用默认标题 dialog

***

### width?

> `optional` **width?**: `string` \| `number`

Defined in: [lib/form.ts:4958](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4958)

dialog 控件宽度，传数字时为像素值，传 fill 时代表填充可用宽度

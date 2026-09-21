[**Documents for clickgo**](../../../index.md)

***

[Documents for clickgo](../../../index.md) / [lib/form](../index.md) / IFormDialogOptions

# Interface: IFormDialogOptions

Defined in: [lib/form.ts:4839](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4839)

Dialog 选项

## Properties

### autoDialogResult?

> `optional` **autoDialogResult?**: `boolean`

Defined in: [lib/form.ts:4847](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4847)

点击按钮后是否自动将按钮文本写入 dialogResult，默认 true

***

### buttons?

> `optional` **buttons?**: `string`[]

Defined in: [lib/form.ts:4845](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4845)

底部按钮文本列表，默认使用当前语言的确定按钮文本

***

### content

> **content**: `string`

Defined in: [lib/form.ts:4843](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4843)

dialog 内容，支持直接传布局字符串

***

### data?

> `optional` **data?**: `Record`\<`string`, `any`\>

Defined in: [lib/form.ts:4861](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4861)

传值，需要用 data.x 读取

***

### direction?

> `optional` **direction?**: `"v"` \| `"h"`

Defined in: [lib/form.ts:4850](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4850)

dialog 控件内容布局方向，h 为横向，v 为纵向

***

### gutter?

> `optional` **gutter?**: `string` \| `number`

Defined in: [lib/form.ts:4852](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4852)

dialog 控件内容区项目间距，会透传给 dialog 控件

***

### height?

> `optional` **height?**: `string` \| `number`

Defined in: [lib/form.ts:4856](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4856)

dialog 控件高度，传数字时为像素值，传 fill 时代表填充可用高度

***

### methods?

> `optional` **methods?**: `Record`\<`string`, (...`param`) => `any`\>

Defined in: [lib/form.ts:4863](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4863)

传值，需要用 methods.x 读取

***

### onMounted?

> `optional` **onMounted?**: () => `void` \| `Promise`\<`void`\>

Defined in: [lib/form.ts:4883](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4883)

窗体挂载完成事件

#### Returns

`void` \| `Promise`\<`void`\>

***

### padding?

> `optional` **padding?**: `string` \| `boolean`

Defined in: [lib/form.ts:4858](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4858)

dialog 控件内容区是否显示内边距，默认表现与控件自身一致

***

### path?

> `optional` **path?**: `string`

Defined in: [lib/form.ts:4867](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4867)

路径基，以 / 结束或文件路径则以文件的基路径为准，可留空

***

### select?

> `optional` **select?**: (`this`, `e`, `button`) => `void`

Defined in: [lib/form.ts:4874](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4874)

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

Defined in: [lib/form.ts:4865](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4865)

样式表

***

### title?

> `optional` **title?**: `string`

Defined in: [lib/form.ts:4841](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4841)

dialog 窗体标题，不传则使用默认标题 dialog

***

### width?

> `optional` **width?**: `string` \| `number`

Defined in: [lib/form.ts:4854](https://github.com/maiyun/clickgo/blob/master/dist/lib/form.ts#L4854)

dialog 控件宽度，传数字时为像素值，传 fill 时代表填充可用宽度

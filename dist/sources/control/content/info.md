内容容器组件，用于统一管理内容布局。

### 参数

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### gutter

`number` | `string`

内容间距。

#### alignH

`string` | `undefined`

内容水平对齐方式。

#### alignV

`string` | `undefined`

内容垂直对齐方式。

#### fill

`boolean` | `string`

是否填满父容器，默认 false。

### 方法

#### check

`(): boolean`

检查内部所有表单控件的必填项，返回是否通过。

### 样式

使用 flex 布局，支持水平和垂直两种排列方向。子元素按指定方向和间距排列。

支持设置对齐方式。fill 模式下占满父容器空间。

常用于表单布局，可统一管理内部表单控件的校验。

### 示例

```xml
<content direction="v" :gutter="10">
    <text v-model="name" require></text>
    <button @click="submit">Submit</button>
</content>
```
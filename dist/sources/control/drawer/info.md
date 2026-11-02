侧边滑出的抽屉组件。

### 参数

#### modelValue

`boolean` | `string`

双向绑定，是否显示，默认 false。

#### title

`string`

标题。

#### width

`number` | `string`

宽度，默认 `35%`。

#### padding

`boolean` | `string`

主内容区是否保留默认内边距，默认 true；不影响标题和 footer 的内边距。设为 false 后，由插槽内容自行安排留白。嵌入 Flow 等滚动容器时，将所需留白放在滚动内容内部，为控件焦点描边和阴影保留空间。

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

#### close

`boolean` | `string`

点击遮罩层是否关闭，默认 false。

### 事件

#### changed

`() => void`

状态改变后触发。

### 样式

使用固定定位，从右侧滑出显示。抽屉具有标题栏和内容区域，标题栏包含标题文本和关闭按钮。

抽屉打开时背景显示半透明遮罩。具有平滑的滑入/滑出动画效果。

内容区域使用 flex 布局，支持自定义布局方向、对齐方式和间距。

### 示例

```xml
<drawer v-model="show" title="Drawer Title">Content</drawer>
```

自定义滚动内容的内边距：

```xml
<drawer v-model="show" title="Filters" direction="v" :padding="false">
    <flow direction="v" style="flex: 1; min-height: 0">
        <layout direction="v" gutter="10" style="padding: 20px; flex-shrink: 0">
            <text placeholder="Keyword" />
            <select :data="['All', 'Enabled', 'Disabled']" />
        </layout>
    </flow>
</drawer>
```

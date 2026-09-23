桌面软件状态栏容器。默认位于纵向布局末尾，左侧内容使用默认插槽，右侧内容使用 `right` 插槽。

### 参数

#### border

`boolean` | `string`

是否显示顶部分隔线，默认 `true`。

#### separator

`boolean` | `string`

是否显示各状态项之间的左右分隔线，默认 `true`。

#### plain

`boolean` | `string`

是否使用透明背景，默认 `false`。

#### scroll

`boolean` | `string`

内容超出时是否允许横向滚动，默认 `true`。鼠标滚轮和触摸拖动均可操作；存在未显示内容时，对应边缘会显示渐变提示。`right` 插槽中的状态项始终固定在状态栏右侧。

### 示例

```xml
<statusbar>
    <statusbar-item type="primary">Ready</statusbar-item>
    <statusbar-item>12 items</statusbar-item>
    <template v-slot:right>
        <statusbar-item>100%</statusbar-item>
    </template>
</statusbar>
```

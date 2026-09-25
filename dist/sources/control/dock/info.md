桌面软件侧栏停靠容器。负责展开、收起和浮动显示，与 `dock-group`、`dock-item` 搭配使用；业务内容由 Form/Panel 的局部应用组件提供。当所属 Form 宽度小于 `600px` 时，Dock 会自动进入不可展开的收起模式，并在空间恢复后回到 `expanded` 指定的状态。收起后的浮动面板宽度不会超过 Dock 到浏览器视窗边缘的剩余空间。

### 参数

#### expanded

`boolean` | `string`

双向绑定，是否展开，默认 `true`。

#### width

`number` | `string`

展开宽度，默认 `280`。

#### position

`'left'` | `'right'`

侧栏所在位置，控制边框、折叠箭头和浮动面板的展开方向，默认 `right`。

### 方法

#### toggle

`() => void`

切换展开状态。

#### closeFloat

`() => void`

关闭当前浮动面板。

### 示例

```xml
<dock v-model:expanded="expanded" position="left">
    <dock-group v-model="selected">
        <dock-item name="layers" label="Layers" lazy cache>
            <layer-list></layer-list>
        </dock-item>
    </dock-group>
</dock>
```

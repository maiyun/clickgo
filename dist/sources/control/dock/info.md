桌面软件侧栏停靠容器。负责展开、收起和浮动显示，与 `dock-group`、`dock-item` 搭配使用；业务内容由 Form/Panel 的局部应用组件提供。

### 参数

#### expanded

`boolean` | `string`

双向绑定，是否展开，默认 `true`。

#### width

`number` | `string`

展开宽度，默认 `280`。

### 方法

#### toggle

`() => void`

切换展开状态。

#### closeFloat

`() => void`

关闭当前浮动面板。

### 示例

```xml
<dock v-model:expanded="expanded">
    <dock-group v-model="selected">
        <dock-item name="layers" label="Layers" lazy cache>
            <layer-list></layer-list>
        </dock-item>
    </dock-group>
</dock>
```

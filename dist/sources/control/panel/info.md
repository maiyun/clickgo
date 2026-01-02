用于管理多个视图切换的面板组件。

### 参数

#### modelValue

`string`

当前显示的视图 Key。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### map

`Record<string, string | (new () => AbstractPanel)>` | `null`

视图映射表。

### 事件

#### go

`(event: IPanelGoEvent) => void`

跳转开始时触发，包含 `from` 和 `to`。

#### went

`(event: IPanelWentEvent) => void`

跳转完成后触发，包含 `result`、`from` 和 `to`。

### 样式

使用相对定位容器，内部视图使用绝对定位层叠显示。视图切换时具有滑动过渡动画。

非朴素模式下具有背景色。支持动态加载和缓存视图组件。

视图容器填满父元素空间，支持嵌套使用实现多级导航。

### 示例

```xml
<panel :map="map"></panel>
```
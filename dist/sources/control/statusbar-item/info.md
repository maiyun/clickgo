状态栏内容项。用于承载文字、图标或其他轻量控件。

### 参数

#### grow

`boolean` | `string`

是否占用状态栏剩余空间，默认 `false`。

#### type

`'default'` | `'primary'` | `'info'` | `'warning'` | `'danger'` | `'cg'`

语义颜色，默认 `default`。

#### clickable

`boolean` | `string`

整项可点击，默认 `false`；通过 `@click` 响应激活。启用后支持 Tab 聚焦、Enter 和 Space 激活；平时保持扁平，悬停、按下及键盘聚焦时显示反馈。不嵌套其他交互控件。

#### disabled

`boolean` | `string`

禁用可点击项，默认 `false`；禁用时不参与 Tab 导航、不触发 `click`。

### 示例

```xml
<statusbar-item type="info">Synchronizing</statusbar-item>
<statusbar-item clickable @click="chooseEncoding" tip="Change text encoding">UTF-8</statusbar-item>
```

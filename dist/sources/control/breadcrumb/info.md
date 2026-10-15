面包屑导航，由直属 Breadcrumb-item 组成。按显示顺序自动将最后一项标记为当前位置；当前位置不触发选择，也不进入键盘 Tab 顺序。

单独加载 `/clickgo/control/breadcrumb`，包内包含 Breadcrumb 和 Breadcrumb-item。

### 参数

#### label

`string`

导航区域的无障碍名称，默认空字符串。应用可提供本地化文案。

#### separator

`string`

分隔文本，默认 `/`。分隔符不参与无障碍朗读。

#### disabled

`boolean` | `string`

是否禁用全部子项的操作，默认 false。

### 事件

#### select

`(event: clickgo.control.IBreadcrumbSelectEvent) => void`

点击或按 Enter、Space 激活可操作的历史层级时触发一次，`event.detail` 为 `{ name: string, index: number }`，index 从 0 开始。控件不修改应用路由、地址或窗体 Hash；应用通过事件执行导航。

### 插槽

- `default`：直属 Breadcrumb-item，支持 v-if、v-for 和带 key 的动态重排。通过插槽内容增删层级，不使用 CSS 隐藏项表示删除。

### 样式

使用主题文字、主色及焦点轮廓；`--breadcrumb-gap` 控制分隔符两侧间距，默认 `var(--g-padding)`。内容过长时允许换行，RTL 下跟随阅读方向排列。

### 示例

```xml
<breadcrumb label="Breadcrumbs" @select="onBreadcrumbSelect">
    <breadcrumb-item name="workspace" label="Workspace"></breadcrumb-item>
    <breadcrumb-item name="orders" label="Orders"></breadcrumb-item>
    <breadcrumb-item label="Order details"></breadcrumb-item>
</breadcrumb>
```

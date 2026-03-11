这是一个用于实现虚拟滚动瀑布流布局的控件，支持高度不一的元素在多列显示中按照贪心算法填入最短列，从而形成典型的瀑布流体验。底层利用虚拟化机制（Virtualization），仅渲染在视口（及其上下缓冲区域）内可见的 `DOM` 节点，能够支持超大数据量的平滑滚动和渲染。

### 参数

#### data

`any[]`

瀑布流的数据源，默认 `[]`。

#### columns

`number` | `string`

瀑布流的列数，默认 2。

#### gap

`number` | `string`

列与列、行与行的间距（以像素为单位），默认 10。

#### sizes

`Record<string, number | undefined>`

高度映射对象，用于告诉组件每个数据项需要渲染的高度。键为数据项索引或唯一 `id`，值为该项对应的像素高度。当前虚拟化强依赖于预知高度。默认的键值为 `{}`。

### 事件

#### scroll

瀑布流内容发生滚动时触发。

- `e`: `Event`

### 方法

暂无供外部调用的公开方法。

### 插槽

#### default

每一项的具体展现内容，可访问当前遍历的当前行。

- `row`: 当前行数据对象
- `index`: 当前行对应的下标。

### 样式

该控件包裹在一个带有 `overflow-y` 设置为 `auto` 的滚动区域内。内部有一层相对于外层采取相对定位（`position: relative`）用来支撑所有列表项总高度的 `inner` 容器。

每一个子项则通过绝对定位并通过 `transform: translate(X, Y)` 去改变它们在 `inner` 中停留的具体坐标系。子项切换位置时默认带有轻微的位移过渡动画（`transition: transform 0.2s`），以防数据或尺寸重计算导致页面内容瞬间闪烁。

同时内部所有距离包括列宽、坐标计算等都会自动减去容器组件设置的 `padding` 大小。

### 示例

```xml
<waterfall :data="[{'id': 1}, {'id': 2}]" :columns="2" :gap="15" :sizes="{'1': 100, '2': 250}">
    <template v-slot="scope">
        <div style="background: red;">内容: {{ scope.row.id }} - 下标: {{ scope.index }}</div>
    </template>
</waterfall>
```
流式布局容器组件，支持滚动和选区。

### 参数

#### direction

`'h'` | `'v'`

内容布局方向，默认 `h`。

#### selection

`boolean` | `string`

是否开启框选，默认 false。

#### gesture

`string[]` | `string`

手势配置。

#### gutter

`number` | `string`

内容间距。

#### scrollLeft

`number` | `string`

双向绑定，横向滚动位置，默认 0。

#### scrollTop

`number` | `string`

双向绑定，纵向滚动位置，默认 0。

### 事件

#### gesture

`(dir: string) => void`

触发手势时触发。

#### beforeselect

`() => void`

框选开始前触发。

#### afterselect

`() => void`

框选结束后触发。

#### select

`(event: IFlowSelectEvent) => void`

框选中触发，包含 `area` 信息。

#### clientwidth

`(val: number) => void`

内部可用宽度改变时触发。

#### clientheight

`(val: number) => void`

内部可用高度改变时触发。

#### scrollwidth

`(val: number) => void`

内部滚动宽度改变时触发。

#### scrollheight

`(val: number) => void`

内部滚动高度改变时触发。

### 样式

使用 flex 布局，支持水平和垂直滚动。子元素按指定方向和间距排列。

框选模式下可拖动创建选区矩形，选中区域内的元素。支持手势操作触发自定义事件。

内容超出时自动显示滚动条。滚动位置可双向绑定。

### 示例

```xml
<flow direction="v" :gutter="10" :selection="true">
    <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</flow>
```

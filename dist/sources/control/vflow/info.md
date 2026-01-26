虚拟列表流组件，支持高性能渲染大量数据。

### 参数

#### direction

`'h'` | `'v'`

滚动方向，默认 `h`。

#### selection

`boolean` | `string`

是否开启框选，默认 false。

#### gesture

`string[]` | `string`

手势配置。

#### scrollLeft

`number` | `string`

双向绑定，横向滚动位置。

#### scrollTop

`number` | `string`

双向绑定，纵向滚动位置。

#### data

`any[]` | `number`

列表数据或数量。

#### sizes

`Record<string, number | undefined>`

尺寸配置。

#### stripe

`boolean` | `string`

是否显示条纹，默认 `false`。

### 事件

#### gesture

`(dir: string) => void`

手势操作时触发。

#### beforeselect

`() => void`

选择前触发。

#### select

`(event: IFlowSelectEvent) => void`

选择时触发，包含 `area` 信息。

#### afterselect

`() => void`

选择后触发。

#### clientwidth

`(val: number) => void`

可视宽度变化时触发。

#### clientheight

`(val: number) => void`

可视高度变化时触发。

#### scrollwidth

`(val: number) => void`

滚动宽度变化时触发。

#### scrollheight

`(val: number) => void`

滚动高度变化时触发。

### 样式

使用虚拟滚动技术，仅渲染可视区域内的元素。支持水平和垂直两种滚动方向。

支持框选功能，可配置手势操作。适用于大数据量的列表渲染。

### 示例

```xml
<vflow :data="items" direction="v"></vflow>
```
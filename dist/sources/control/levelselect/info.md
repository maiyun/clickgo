级联选择器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### async

`boolean` | `string`

是否异步加载，默认 false。

#### plain

`boolean` | `string`

是否朴素模式，默认 false。

#### virtual

`boolean` | `string`

是否开启虚拟滚动，默认 false。

#### map

`object`

数据映射配置。

#### padding

`string`

内边距。

#### minWidth

`number`

弹出层最小宽度。

#### modelValue

`string`

双向绑定，选中的值。

#### placeholder

`string`

占位符。

#### data

`any[]` | `Record<string, any>`

级联数据。

### 事件

#### label

`(labels: string[]) => void`

获取标签时触发。

#### load

`(value: string, callback: (children?: any[]) => void) => void`

异步加载时触发。

#### loaded

`() => void`

加载完成时触发。

#### level

`(event: ILevelselectLevelEvent) => void`

层级变化时触发，包含 `list`、`values` 和 `labels`。

### 样式

使用 flex 布局，显示当前选中路径。点击弹出级联选择面板。

面板多列显示，每列对应一个层级。选中项高亮显示，下级数据在右侧列展示。

### 示例

```xml
<levelselect :data="regions" v-model="selected"></levelselect>
```
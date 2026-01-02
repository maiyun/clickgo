属性面板组件，用于显示和编辑对象属性。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### sort

`'kind'` | `'letter'`

双向绑定，排序方式，默认 `kind`。

#### type

`'property'` | `'event'`

双向绑定，显示类型，默认 `property`。

#### desc

`boolean` | `string`

是否显示描述，默认 true。

#### modelValue

`any[]`

双向绑定，属性数据列表。

### 样式

使用 flex 布局，垂直排列工具栏、内容区域和描述区域。每行显示属性名和对应的编辑控件。

支持按类别或字母排序。可切换显示属性或事件。不同类型的值使用不同的编辑控件。

### 示例

```xml
<property v-model="props" v-model:sort="sortBy" v-model:type="viewType"></property>
```

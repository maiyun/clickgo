分页组件。

### 参数

#### modelValue

`number` | `string`

双向绑定，当前页码，默认 1。

#### max

`number` | `string`

最大页数。

#### total

`number` | `string`

总条数。

#### count

`number` | `string`

每页条数，默认 10。

#### counts

`number[]` | `string`

每页条数选项列表。

#### control

`number` | `string`

显示的页码按钮数量，默认 2。

### 事件

#### change

`(event: IPageChangeEvent) => void`

页码改变时触发。

#### countchange

`(event: IPageCountchangeEvent) => void`

每页条数改变时触发。

#### countchanged

`(event: IPageCountchangedEvent) => void`

每页条数改变后触发。

### 样式

使用 flex 布局，包含页码按钮、上下页按钮和跳转输入框。当前页码高亮显示。

支持每页条数选择下拉框。页码过多时显示省略号和首尾页按钮。

按钮具有悬停和激活效果。显示总条数信息。

### 示例

```xml
<page v-model="currentPage" :total="100" :count="10"></page>
```

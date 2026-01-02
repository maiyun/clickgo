Monaco 代码编辑器组件。

### 参数

#### disabled

`boolean` | `string`

是否禁用，默认 false。

#### readonly

`boolean` | `string`

是否只读，默认 false。

#### modelValue

`string`

双向绑定，编辑器内容。

#### language

`string`

代码语言。

#### theme

`string`

编辑器主题。

#### files

`Record<string, any>`

双向绑定，文件列表配置。

### 事件

#### jump

`(info: { path: string; start: number; end?: number }) => void`

跳转时触发。

#### init

`(info: { monaco: any; instance: any }) => void`

编辑器初始化完成时触发。

### 样式

使用 flex 布局，编辑器填满容器空间。支持语法高亮、自动补全、代码折叠。

支持多种编程语言。主题可随系统切换。具有行号和小地图。

### 示例

```xml
<monaco v-model="code" language="javascript" @init="onInit"></monaco>
```

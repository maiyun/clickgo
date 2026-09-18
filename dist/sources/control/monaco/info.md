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

双向绑定。`files` 为空或未设置时为编辑器内容；`files` 非空时为当前文件的路径。
路径不存在时显示空编辑区，不保留上一个文件。

#### language

`string`

当前文件的代码语言，不区分大小写。为空时，多文件按扩展名推断，单文件使用纯文本。

#### theme

`string`

编辑器主题，如 `vs`、`vs-dark`、`hc-black`、`hc-light`。为空时使用 `vs`。

#### files

`Record<string, string>` | `undefined`

双向绑定，键为文件路径或 URI，值为文本内容，默认 `{}`。
非空时进入多文件模式，所有文件参与代码提示；清空后进入单文件模式。
声明文件（`.d.ts`、`.d.mts`、`.d.cts`）的新增、修改和删除会自动刷新类型诊断，无需修改当前代码。
编辑时发出新的文件对象。切换文件保留撤销历史、选区和滚动位置。

#### options

`Record<string, unknown>`

Monaco 编辑器选项，默认 `{}`，支持动态更新，如 `wordWrap`、`tabSize`、`minimap`。
`readonly`、`disabled` 优先于选项中的 `readOnly` 和 `domReadOnly`。
控件使用自定义右键菜单和自己的文本模型，`contextmenu`、初始化 `model` 由控件管理。
未设置字体选项时继承控件字体，默认关闭小地图并自动调整布局。

### 事件

#### jump

`(info: { resource: Monaco.Uri; options: { selection?: Monaco.IRange | Monaco.IPosition } }) => void`

跳转到其他文件时触发。`resource.path` 为目标路径，`options.selection` 为目标位置。
由应用切换当前文件并设置选区；控件不会自动切换文件。

#### init

`(info: { monaco: any; instance: any }) => void`

编辑器初始化完成时触发。

#### error

`(info: { stage: 'iframe' | 'loader' | 'module' | 'editor' | 'timeout' | 'clipboard'; error: unknown }) => void`

加载或剪贴板操作失败时触发。初始化失败结束加载状态并释放资源。

#### change

`(event: { detail: { path: string; value: string } }) => void`

编辑器内容改变时触发，包括用户编辑、撤销、重做。单文件模式的 `path` 为空字符串。
外部绑定内容同步不重复触发。

#### focus

`() => void`

编辑区获取焦点时触发。

#### blur

`() => void`

编辑区失去焦点时触发。

### 方法

#### execCmd(ac)

执行 `copy`、`cut`、`paste`。禁用时不执行，只读时只允许复制。
自定义剪切处理非空选区；编辑器内的快捷键由 Monaco 处理。

#### refreshModels()

根据当前绑定刷新文件和内容，一般由控件自动调用。

通过 `init` 或控件 `access.instance` 可调用 Monaco 编辑器公开 API，如格式化、查找、设置选区。

### 样式

使用 flex 布局，编辑器填满容器空间。支持语法高亮、自动补全、代码折叠。

支持多种编程语言、行号，可通过 `theme` 切换主题，通过 `options` 开启小地图。

### 示例

```xml
<monaco v-model="code" language="javascript" @init="onInit"></monaco>
```

```xml
<monaco v-model="path" v-model:files="files" :options="{wordWrap: 'on', minimap: {enabled: true}}" @change="onChange" @error="onError"></monaco>
```

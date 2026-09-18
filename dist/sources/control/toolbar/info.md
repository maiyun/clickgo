桌面软件命令工具栏。默认保持单行显示，空间不足时允许横向滚动；需要固定显示的命令或“更多”菜单可放入右侧插槽。

### 参数

#### border

`boolean` | `string`

是否显示工具栏底部分隔线，默认 `true`。

#### plain

`boolean` | `string`

是否使用透明背景，默认 `false`。

#### scroll

`boolean` | `string`

内容超出时是否允许横向滚动，默认 `true`。鼠标滚轮和触摸拖动均可操作；存在未显示内容时，对应边缘会显示渐变提示。

### 插槽

#### default

工具栏主要命令。

使用 `<toolbar-split></toolbar-split>` 分隔不同功能组，无需业务侧自定义分隔线样式。

#### right

始终固定在工具栏右侧的命令。可在这里放置带 `pop` 插槽的按钮，将低优先级命令保留为 ClickGo 菜单。

### 示例

```xml
<toolbar>
    <button type="tool">Open</button>
    <button type="tool">Save</button>
    <toolbar-split></toolbar-split>
    <button type="tool">Undo</button>
    <template v-slot:right>
        <button type="tool" area="mark">
            More
            <template v-slot:pop>
                <menulist>
                    <menulist-item @click="exportFile">Export</menulist-item>
                </menulist>
            </template>
        </button>
    </template>
</toolbar>
```

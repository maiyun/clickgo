任务栏布局控件。应用项和托盘内容由调用方提供，控件不读取全局任务，也不执行其他应用的命令。

### 参数

#### position

`string`，默认 `bottom`。支持 bottom、top、left、right。

#### mode

`string`，默认 `bar`。`bar` 填满任务栏所在边；`dock` 使用自然尺寸、圆角和内边距。task-start 和 task-item 自动跟随该模式。

#### margin

`number | string`，默认 `8`。dock 的视窗外边距，用于限制最大尺寸。系统任务栏应绑定 `core.config['task.margin']`，让显示与框架定位一致。

#### showDate

`boolean | string`，默认 `true`。是否显示时间和日期。日期按当前语言格式显示月、日（支持内置 16 种语言），使用本地时区并在跨日时更新。日期和时间的先后顺序取自当前语言的本地化组合格式；横向按该语言的阅读方向并排显示，纵向按相同顺序上下排列，时间数字始终从左到右显示。

### 插槽

默认插槽放 task-start、task-item；tray 插槽放 task-tray；pop 插槽提供任务栏背景右键菜单。启动入口的显示与状态由调用方控制。

### 样式

dock 的运行标记为短横线，焦点应用稍长；multi 表示同一应用有多个窗体。内容超出可用长度时应用区滚动，菜单 Teleport 到当前 Form 的 system 浮层。

### 示例

```xml
<task :position="position" :mode="mode" :margin="margin">
    <task-item v-for="app of apps" :opened="app.opened" :selected="app.selected" :multi="app.formCount > 1" @click="openApp(app)">
        <img :src="app.icon"></img>
    </task-item>
    <template v-slot:tray>
        <task-tray v-for="item of trays" :key="item.id" :icon="item.icon" :tip="item.tip" :menu="item.menu"
            @activate="activate(item.id)" @menu="activate(item.id, $event.detail.id)"></task-tray>
    </template>
</task>
```

替换系统 task app 的契约和应用侧注册示例见 `doc/task-tray.md`。

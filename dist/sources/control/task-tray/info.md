托盘显示控件，随 `/clickgo/control/task` 加载。只负责显示和交互，不注册系统托盘、不直接访问其他应用。

### 参数

#### icon

`string`，默认空。图标 URL；系统托盘使用 `task.getTrayList()` 快照中的 icon。

#### tip

`string`，默认空。悬停提示。

#### menu

`task.ITrayMenuItem[]`，默认空。菜单项包含 id、label，可设置 disabled 或 separator。

### 事件

#### activate

左键点击图标，或聚焦后按 Enter/空格。右键与触摸长按只打开菜单；Shift+F10/菜单键也可打开。Esc 关闭菜单并恢复触发器焦点。

#### menu

菜单命令，`event.detail.id` 为菜单 ID。

### 插槽

默认插槽可替换图标；`contextmenu` 可替换自动生成的菜单。自定义菜单自行处理事件。

### 示例

```xml
<task>
    <template v-slot:tray>
        <task-tray v-for="item of trays" :key="item.id" :icon="item.icon" :tip="item.tip" :menu="item.menu"
            @activate="activate(item.id)" @menu="activate(item.id, $event.detail.id)"></task-tray>
    </template>
</task>
```

系统任务栏将操作通过 `task.activateTray(this, id, menuId?)` 转交所属 App/Form。完整契约见 `doc/task-tray.md`。

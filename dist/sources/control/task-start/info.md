任务栏的启动入口。拥有独立主题样式，不继承普通 Button 的外观，不读取全局 Launcher 状态或自动打开菜单。

### 参数

#### icon

`string`，默认空。图标资源路径；bar 使用 16px，dock 使用 24px。可用 icon 插槽替换。

#### label

`string`，默认空。由应用传入本地化文字，也用作无障碍名称；即使隐藏文字仍应提供。

#### showLabel

`boolean | string`，默认 `auto`。auto 由主题决定；true 强制显示，false 强制隐藏。Classic 默认显示，其余内置主题默认隐藏。

#### opened

`boolean | string`，默认 false。菜单或 Launcher 打开期间的持续状态，由调用方同步；不随鼠标释放而重置。

#### disabled

`boolean | string`，默认 false。禁用指针、Enter 和 Space 激活，不进入键盘焦点顺序。

### 事件

#### tap

鼠标、触摸或键盘激活，参数为触发的 Event（指针激活沿用框架的 tap 事件，键盘激活为 KeyboardEvent）。Enter 按下激活，Space 释放激活；不自动改变 opened。模板可写 `@click` 或 `@tap`，ClickGo 将 `@click` 编译为 `@tap`，每次操作只投递一次。

### 插槽

icon 插槽替换默认图标，文字由 label 与 showLabel 控制。位置和 bar/dock 模式跟随上层 task。

### 样式

独立的 wrap、content、icon、label；opened、active、label-auto/show/hide、dock 和位置类可供主题使用。图标及内容移动不改变控件尺寸。通过 `--task-start-label-display` 控制 auto 文字显隐，`--task-start-color` 与 `--task-start-background-hover/active/opened` 定义颜色。

### 示例

```xml
<task>
    <task-start icon="/clickgo/icon.png" :label="l('start')" :opened="launcherShown" @click="toggleLauncher"></task-start>
    <task-item v-for="app of apps" :opened="app.opened"></task-item>
</task>
```

使用系统 Launcher 时，首次读取 `form.getLauncherShow()`，在 `onLauncherShowChanged(state)` 更新 launcherShown；使用自定义菜单时同步自己的菜单状态。无需 Launcher 或系统权限也可使用本控件。

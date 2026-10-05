# Task、Dock 与系统托盘

task 是布局控件；task-start、task-item 和 task-tray 是显示及交互控件。它们不持有应用实例、不自动注册为系统任务栏，也不执行应用操作。官方 task app 与用户开发的替代 task app 都使用同一组公共 API。

## 启动入口与 Launcher 状态

`task-start` 是独立启动入口，与其他任务栏子控件一起打包在 `/clickgo/control/task`；应用同时加载 `/clickgo/control/common` 提供基础图标等控件。通过 icon、label 传入图标与本地化文字；showLabel 默认 auto，由主题决定是否显示文字，也可显式设为 true/false。整个入口是否显示由应用的 v-if 决定。opened 表示菜单持续打开状态，disabled 禁用激活；click 响应鼠标、触摸、Enter 和 Space。控件不自动打开 Launcher，也不修改 opened。

```xml
<task>
    <task-start icon="/clickgo/icon.png" :label="l('start')" :opened="launcherShown" @click="toggleLauncher"></task-start>
    <!-- 应用项与托盘内容 -->
</task>
```

使用系统 Launcher 时，首次挂载读取 `clickgo.form.getLauncherShow()`，在 App 或 Form 的 `onLauncherShowChanged(state: boolean)` 中更新自己的 launcherShown。事件也投递到宿主 Boot；同一逻辑状态的重复 show/hide 不重复通知。关闭开始时状态为 false，关闭动画结束后隐藏内容；动画期间重新打开会取消旧清理。通过 `showLauncher()` / `hideLauncher()` 切换；不根据按钮点击次数猜测状态。

使用自定义菜单时，直接把菜单的显示状态绑定到 opened，无需系统 Launcher。各主题可独立定义 task-start 的普通、悬停、焦点、临时按下、opened 和禁用外观；Classic 在 opened 期间保持凹边，其他内置主题使用各自的背景状态色。

## 应用注册托盘

```ts
const id = await clickgo.task.createTray(this, {
    'icon': '/package/res/icon.png',
    'tip': '我的应用',
    'menu': [
        { 'id': 'show', 'label': '显示窗口' },
        { 'id': 'split', 'label': '', 'separator': true },
        { 'id': 'exit', 'label': '退出' }
    ]
});
```

`createTray` 返回 ID 或 false。可注册多个托盘；即使 task app 尚未运行也会保留注册。包内图标使用 `/package/` 绝对路径，公共资源使用 `/clickgo/`，也支持 data/http(s) URL。框架在所属任务的文件权限下解析图标，向任务栏提供跨任务可用的 URL。

`updateTray(this, id, partialOptions)` 更新图标、提示、菜单，返回 Promise<boolean>；异步图标更新被后来图标更新/删除取代时返回 false；同时修改提示或菜单不取消图标读取。菜单只复制公开字段，重复菜单 ID 保留首项。`removeTray(this, id)` 返回 boolean。普通任务只可更新/删除自己的托盘。数据进入和离开注册表时复制，任务栏修改快照不会修改应用菜单。

应用任务结束时框架删除全部托盘；关闭一个 Form 不自动删除任务级托盘。Form 所持有的临时托盘应在 onBeforeUnmount 中删除，并处理尚未结束的异步注册。Library task 示例展示了这个流程。

## 接收操作

在 AbstractApp 或 AbstractForm 中实现：

```ts
public async onTrayClick(trayId: string): Promise<void> {
    // 按 trayId 找到属于自己的窗口，恢复或聚焦。
}

public async onTrayMenuClick(trayId: string, menuId: string): Promise<void> {
    // 应用解释命令；task app 不接收函数、App/Form 引用或任意业务参数。
}
```

框架只向所属任务的 App 和现存 Form 投递。多个接收者会收到同一通知，需按 trayId 过滤，并在 App/Form 中选择一个位置执行操作，避免重复处理。普通应用不能向其他应用投递托盘命令。

## 自定义 task app

1. 如既有 task app，在 Form 中提供 `position`（绑定公共配置），调用 `task.setSystem(this, this.formId)` 注册系统任务栏。读取其他应用的任务/窗体事件仍沿用已有 root 权限机制。
2. 首次挂载用 `task.getTrayList(this)` 获取快照；在公共 `onTrayCreated(taskId, trayId)`、`onTrayChanged`、`onTrayRemoved` 事件中重新读取。事件向所属任务、当前系统任务栏及 root 任务投递。普通任务只能读取自己的托盘。先注册系统任务栏再同步快照，不使用异步原始任务列表初始化托盘。
3. `config.json` 加载 `/clickgo/control/common` 和 `/clickgo/control/task`。task 包包含 task-start、task-item 和 task-tray。
4. 显示 `<task-tray :icon="item.icon" :tip="item.tip" :menu="item.menu">`。将 `activate` 与 `menu` 控件事件交给 `task.activateTray(this, item.id, menuId?)`。只有当前注册的系统任务栏可投递，框架校验托盘与菜单是否还存在，以及 disabled/separator。旧任务栏被替换后不能继续投递。

task-tray 的默认插槽可替换图标，contextmenu 插槽可替换菜单。默认菜单支持命令、禁用项和分隔线；业务参数留在所属应用内，由 trayId/menuId 查找。菜单复用 menulist、system Teleport 和 Pointer.js 的右键/触摸长按机制。

## Dock 和可用视口

公共配置：

```ts
clickgo.core.config['task.mode'] = 'dock'; // 默认 bar
clickgo.core.config['task.position'] = 'bottom';
clickgo.core.config['task.margin'] = 8; // dock 外边距，默认 8
```

自定义任务栏向 task 控件绑定这三个值；也可只使用 task 控件在普通 Form 内展示，不改变系统配置。mode 与位置分离，dock 支持四边居中；官方菜单切换到 dock 时首先选择底部。

框架将系统任务栏的 Form 切换到自然尺寸，监听真实尺寸变化，在图标增删、语言变化、视窗缩放后重新居中。边距限制在视窗较短边的四分之一内。`systemTaskInfo.length` 表示所在边的实际厚度加外边距，`core.getAvailArea()` 继续使用矩形工作区；最大化窗体会预留完整底边条带，而不是尝试绕开 dock 两侧。`viewport=true`、安全区 padding 和 bottomMost 的既有语义保持一致。

应用项超长时滚动应用区，托盘和时钟保留可达性。运行标记使用短横线，焦点应用使用稍长横线，多个窗体另有小点。默认 bar 模式继续显示长横线。

## 示例

- Demo → Control → Task / Tray：四个位置、bar/dock、时钟、opened/selected/multi、托盘点击和菜单。
- Demo → Method → task：注册/更新/删除真实托盘、最小化后点击恢复、禁用菜单、菜单移除。
- 官方任务栏背景右键菜单：任务栏和居中 Dock 切换。

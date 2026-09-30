固定区域的桌面图标控件。与 Iconview 的可滚动图标列表不同，Desktop 保存每个图标的独立位置，支持拖动摆放，并在区域缩小时修正越界位置。没有滚动条，也不响应滚轮滚动。

### 参数

#### data

`IDesktopItem[]`，默认 `[]`。每项必须有唯一、非空的字符串 `id` 和 `name`，可设 `icon`、`path`（通用文件拖拽载荷）、`type`（0 文件夹，1 文件）和 `locked`。缺少 ID 的项不显示，重复 ID 只使用第一项。ID 与名称、数组顺序无关；名称或顺序变化不会改变图标身份。`locked` 仅阻止用户拖动，区域调整时仍可重排。自定义业务字段可附加在原数据上，默认插槽取得该项。

#### modelValue

`string[]`，默认 `[]`。选中图标的 ID 数组，使用 `v-model` 双向绑定。删除图标或切换单选时自动清理选择；缩小区域不会删除溢出项的选择。Ctrl/Command+A 选择当前显示的图标。

#### positions

`TDesktopPositions`，默认 `{}`。使用 `v-model:positions` 双向绑定。结构为 `{ [id]: { x, y } }`，坐标单位为控件内边缘起算的物理像素，包括 `padding`。RTL 下已经保存的坐标不镜像；自动分配新位置时从右侧开始。没有指定位置的项自动分配空位。

这里保存的是用户期望的位置，不是因窗口缩小而临时调整的显示位置。控件不修改输入对象；新图标分配位置、主动设置位置、拖动或整理后输出新的独立快照，数据删除时移除其位置。窗口缩小时只调整显示布局，恢复空间后重新使用保存位置，不把临时位置回写给父组件；可以直接持久化本属性。

手动移动只更新参与拖动的图标；若主动占据了其他图标原先的保存位置，让位项重新寻找空位。其他因窗口缩小而临时移动的图标仍会恢复。应用主动修改的位置同样优先处理。`layout.detail.positions` 是当前显示布局，`layout.detail.preferredPositions` 是可持久化布局。

#### disabled

`boolean | string`，默认 `false`。禁用用户输入，包括打开图标、拖动、框选和菜单；属性和尺寸变化仍同步布局。

#### plain

`boolean | string`，默认 `false`。设为 `true` 隐去控件背景和外边框，适合放在桌面 Form 中。此模式或设置了 `background` 时，图标悬停、选中和目录拖入反馈使用浅色半透明底色，选中和键盘活动项带边框，保留壁纸细节。普通主题背景模式仍沿用主题反馈。主题可通过 `--g-desktop-background-hover`、`--g-desktop-background-selected`、`--g-desktop-background-active` 及对应的 `--g-desktop-border-color-hover/selected/active` 覆盖这些状态。

#### keepActive

`boolean | string`，默认 `false`，模板属性为 `keep-active`。保持正常文字颜色，不继承 Form 失焦时的灰色外观，适合置底桌面。只影响视觉，不改变 Form 焦点、键盘输入归属或控件的焦点提示；`disabled` 仍显示禁用颜色，自定义插槽内子控件自身的状态也不被覆盖。

#### background

`string`，默认 `''`。CSS `background` 简写，可设置颜色、渐变或 `url(...)` 图片，不叠加遮罩或滤镜。图片应由应用加载为可访问的 URL 或数据 URL；不会自动读取 `/package/` 路径。设置后覆盖控件的主题背景，`plain` 仍控制边框和默认背景。

#### backgroundSize

`string`，默认 `''`，模板属性为 `background-size`。遵循 CSS `background-size`：`cover` 保持比例填满并裁切，`contain` 保持比例完整显示，`100% 100%` 拉伸填满，`auto` 使用原始尺寸，也支持 `160px auto` 等自定义尺寸。空值保留 `background` 简写或样式中的尺寸设置；未设置时按 CSS 默认 `auto`。

#### backgroundRepeat

`string`，默认 `''`，模板属性为 `background-repeat`。支持 CSS 的 `no-repeat`、`repeat`、`repeat-x`、`repeat-y`、`space` 和 `round`。空值保留原有设置；未设置时按 CSS 默认 `repeat`。平铺通常搭配 `auto` 或自定义尺寸。

#### backgroundPosition

`string`，默认 `''`，模板属性为 `background-position`。支持 `center`、`left top`、`right bottom`、百分比和长度等 CSS 位置。空值保留原有设置；未设置时按 CSS 默认 `0% 0%`。尺寸、平铺、位置互相独立，非空参数覆盖 `background` 简写中的对应设置。

#### textShadow

`boolean | string`，默认 `false`，模板属性为 `text-shadow`。为默认图标名称启用浅色文字和深色多重阴影，提高复杂壁纸上的可读性，不改变壁纸或图标色值。失焦、悬停和选中仍保留名称阴影，禁用时使用主题禁用文字色。主题可通过 `--g-desktop-label-color` 和 `--g-desktop-label-shadow` 覆盖颜色与阴影；自定义默认插槽自行处理文字样式。壁纸由父 Form 提供时也可独立开启。

#### multi

`boolean | string`，默认 `true`。是否支持多选和成组拖动。

#### ctrl

`boolean | string`，默认 `true`。多选时按住 Ctrl/Command 切换选中项。设为 `false` 时普通点击也切换选中项。Shift 依数据顺序选中范围；框选支持 Ctrl/Command 反选和 Shift 添加。

#### selection

`boolean | string`，默认 `true`。是否允许在空白区拖动框选。

#### draggable

`boolean | string`，默认 `true`。是否允许用户拖动；不影响应用通过 `positions` 主动摆放。

#### autoArrange

`boolean | string`，默认 `false`，模板属性为 `auto-arrange`。开启后依数据顺序紧凑排列并停止桌面内部的手动摆放，但仍可拖到目录或其他控件，输入位置也由自动排列修正。关闭后保留当前排列。与网格吸附是独立选项。

#### snap

`boolean | string`，默认 `true`。吸附到不可见网格；关闭后保留合法的自由像素坐标。两种模式都避免最终位置重叠。

#### direction

`'column' | 'row'`，默认 `'column'`。空位按先纵向后横向或先横向后纵向分配，不重新排列已有合法位置；需要整体重新排列时调用 `arrange()`。

#### size

`number | string`，默认 `48`。图像尺寸；超过格子的内容区域时自动限制，长名称最多显示两行。

#### cellWidth

`number | string`，默认 `96`，最小 `24`。单个图标格子的宽度，包含图像、名称和内部留白。模板属性为 `cell-width`。

#### cellHeight

`number | string`，默认 `96`，最小 `40`。单个图标格子的高度。模板属性为 `cell-height`。较大的图像应同时增大格子尺寸。

#### gap

`number | string`，默认 `8`。格子之间的间距，最小 `0`。

#### padding

`number | string`，默认 `8`。区域边缘留白，最小 `0`。默认网格原点为 `(8, 8)`，相邻格子间距为 `cellWidth + gap` 和 `cellHeight + gap`。

### 事件

#### select

`(event: IDesktopSelectEvent) => void`。用户完成选择时触发，`event.detail.value` 为选中 ID 的独立数组。程序回写 `v-model` 不触发此事件。框选预览在松手时一次性同步选择，取消则恢复。

#### open

`(event: IDesktopOpenEvent) => void`。双击、Enter 或默认溢出菜单请求打开图标时触发，`event.detail.value` 为图标 ID 数组。控件只报告请求，实际打开行为由应用处理。

#### layout

`(event: IDesktopLayoutEvent) => void`。布局变化后触发，`detail` 包含显示位置 `positions`、保存位置 `preferredPositions`、`overflow` 和 `reason`。来源为 `data`、`positions`、`resize`、`options`、`arrange` 或 `drag`。拖动期间显示公共拖拽反馈，并在本桌面空白落点显示主题色位置预览；预览与最终摆放共用吸附、边界限制和碰撞处理，多选时预览整组落点。原图标和其他图标保持原位，预览不回写位置或触发布局事件；松手后才提交位置。移出桌面、进入目录或开启自动排列时不显示位置预览。取消、失焦、双指介入或卸载均清理反馈和会话。应用可以根据本事件保存最终位置。

#### overflow

`(event: IDesktopOverflowEvent) => void`。未放入区域的 ID 发生变化时触发，`event.detail.value` 为溢出 ID 数组；全部恢复显示时为 `[]`。

#### drop

`(event: IDesktopDropEvent) => void`。接收与 Iconview 相同的 `type: 'fs'` 通用拖拽数据，`detail` 包含：`self`（是否来自本实例）、`from`（源项目的 ID、索引、类型、路径及可选名称/图标）、`to`（目标目录项，桌面空白为 `null`）、`position`（落点在桌面内的坐标）及可选 `event`（指针事件，可读 Ctrl/Shift/Alt）。旧拖拽源可能不提供事件或 ID。

本实例拖到空白区属于摆放，触发 `layout`；拖到目录或从其他控件拖入时触发 `drop`。控件不擅自增删图标、复制文件或执行移动操作，由应用消费事件并更新数据。`draggable=false` 禁止拖出，仍可接收外部拖入；`disabled=true` 同时禁止发送和接收。

Desktop 和 Iconview 共用 `clickgo.modules.pointer.drag()`，它返回取消句柄，并复用 pointer 的 `setDragData/getDragData`、`data-drop`、`data-hover` 和 `dragenter/dragleave/drop` 协议，支持同一 ClickGo 页面内跨控件、Form 和 task 互通。取消、Esc、失焦、双指或卸载都不投递 `drop`，前景窗体遮挡时不会穿透投递到底层桌面。

### 插槽

**默认插槽**取得 `{ item, selected, position }`，可自定义图标和名称。内容仍在控件给定的格子内；交互子控件自行处理输入。

**pop** 为空白区菜单，取得 `{ position, selected, overflow }`。`position` 是右键或长按位置，`overflow` 为未放下的图标数据。

**itempop** 为图标菜单，取得 `{ item, selected }`。右键先选择未选中的目标，已选中的多选组保持选择。支持触屏长按及 ContextMenu/Shift+F10。菜单使用 ClickGo 系统弹层，保持 Form 隔离。 按 Esc 关闭本控件菜单并恢复桌面焦点，保留当前选择。

**overflow** 取得 `{ items }`，可替换默认 `+N` 入口。替换时应提供这些图标的可达入口。

### 布局边界

先保留所有合法且不碰撞的位置，再为越界或冲突项寻找最近空格，避免数据前部新增项抢占已有位置。区域增大时恢复保存位置，并重新显示溢出项。窗口尺寸引起的临时重排不会覆盖保存位置。

有限区域无法在固定图标尺寸下容纳无限图标。容量不足时为 `+N` 菜单预留一格，未显示项的数据、选择和已有位置都保留；区域小于一格时改用紧凑入口。不会通过重叠、滚动或无限缩小图标隐藏这个限制。自由摆放产生碎片空隙时也可能出现溢出。

方向键依图标的实际物理位置导航，Home/End 跳到首尾，Space 选择，Enter 打开。坐标不随文字方向变化；标签使用自动文字方向。

### 方法

**arrange(): void** 主动整理全部图标，一次性紧凑排列并输出位置。

**open(ids: string[]): void** 请求打开给定图标，适合自定义溢出入口；禁用时不响应。

### 示例

```xml
<desktop :data="icons" v-model="selected" v-model:positions="positions" style="flex: 1;" @open="onOpen">
    <template v-slot:pop>
        <menulist><menulist-item @click="arrange">整理图标</menulist-item></menulist>
    </template>
    <template v-slot:itempop="d">
        <menulist><menulist-item @click="open(d.selected)">打开</menulist-item></menulist>
    </template>
</desktop>
```

参数演示位于 `demo/form/control/desktop`，可开关示例壁纸和文字阴影，调整裁切、适应、拉伸、原始尺寸、平铺及九宫格位置。实战演示位于 `demo/form/solution/desktop`，Form 仅包含 Desktop 控件，使用 `bottomMost = true`，Form 声明 `viewport state-max padding="safe"`，由框架管理全视口最大化和内容安全区；图标随任务栏换边留空，壁纸连续延伸到任务栏下，业务无需维护尺寸或屏幕监听。启用 `keep-active` 保持桌面失焦时的正常颜色。位置持久化和壁纸均由 demo 应用处理，仅在 `layout.reason` 为 `drag` 或 `arrange` 时保存 `preferredPositions`，避免窗口调整和属性回写重复写入。右键可设置或移除内置示例壁纸，Form 的 `background` 承载图片，唯一内容控件仍为 Desktop。Form 同样提供 `background-size`、`background-repeat`、`background-position`，右键菜单可独立调整；Desktop 启用 `text-shadow`，壁纸不再叠加主题色遮罩。Cross-form drag 按钮可打开 Iconview；拖入桌面空白时创建示例图标，拖入目录时展示请求，不修改真实文件。控件没有文件系统或窗口管理职责。

“Reverse data (stable IDs)”只颠倒 data 的顺序，用来验证手动位置按 ID 保存；开启自动排列时，顺序变化才会驱动整体重排。

设计参考：[Apple 桌面整理](https://support.apple.com/en-ke/guide/mac-help/-mh35951/mac)、[Windows 桌面图标位置 API](https://devblogs.microsoft.com/oldnewthing/20130318-00/?p=4933)、[KDE Folder View](https://docs.kde.org/stable_kf6/en/plasma-desktop/plasma-desktop/folder-view.html)。

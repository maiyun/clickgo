CF 风格的浅色主题。主色由 `theme.setMain` 设置，按钮使用纯色；导航使用中性 hover、selected 背景和细竖向子菜单连接线。

基于 light 覆盖共享状态、输入、按钮、Tag/Circle、卡片、表格、导航和浮层。子菜单连接线使用逻辑方向属性，支持多层与 RTL；不修改控件结构或导航行为。

文字不使用阴影；导航文字 13px，小标签 11px，正文、输入和普通菜单项 14px。卡片内边距 20px，普通卡片标题 16px。菜单使用白底、约 33px 普通行高、轻阴影和无边框快捷键提示，勾选与单选保留对齐占位。

Nav 内容为直属 Flow 时，页面 padding 和 scroll-padding 放到 Flow 上，保留焦点阴影在滚动裁切边界内的空间；非 Flow 内容沿用 Nav 主体留白。

暗色版本为 cloud-dark，沿用本主题尺寸并重新设计暗色层级；配色说明见 cloud-dark/info.md。

预览入口为 `dist/test/cloud/`，包含多层导航、筛选、状态标签、输入与禁用态、Actions 多级菜单、弹层、主色和 Light/Dark/System 切换；Demo 的 Library theme 同时提供两个主题。

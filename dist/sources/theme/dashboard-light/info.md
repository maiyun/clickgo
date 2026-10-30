后台工作台主题，深色导航、浅色内容区域、柔和无边框标签。

主色由 `theme.setMain` 设置；主题不覆盖 `--main`。成功、信息、警告和危险色使用各自语义。

菜单、列表、按钮的 hover、active、selected 以及输入和按钮的焦点边框由共享状态色随主色计算；`global` 同时覆盖窗体与 Teleport 弹层。深色导航和强调卡片在中性深色基础上混入当前主色，不固定为绿色。普通页面、输入框和卡片保持中性底色。

Nav 支持 `menu-header` 和 `menu-footer` 固定区。普通卡片使用 Group，强调卡片使用 `type="cg"`；简单统计卡片使用 SGroup。

Circle 与 Tag 共用实心、柔和两种配色规则，均无高光和阴影；`plain` 使用柔和底色与透明边框，`cg` 随主题色变化。实心前景按实际底色选取黑或白，深色导航中的实心成功标记适当提亮。Circle 保留固定直径，小状态点使用非 plain 模式。

图表可读取 `--dashboard-chart-previous`、`--dashboard-chart-info`、`--dashboard-chart-warning`、`--dashboard-chart-grid`，主曲线跟随当前主色。

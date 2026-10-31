cloud-light 的独立暗色版本。使用 `@use '../cloud-light/style'` 共享字号、间距、圆角和菜单尺寸；共享结构及预览入口见 cloud-light/info.md。

页面、卡片、输入和弹层使用逐级抬高的中性暗色表面，导航的 hover/selected 保持中性。边框区分装饰分隔与输入轮廓，正文避免纯白；菜单不添加亮边或发光。柔和语义标签在暗色中重新配色。

Form 的外框和标题栏分隔线共用焦点状态色；聚焦时轮廓更亮，失焦时退为装饰分隔线。

`theme.setMain` 继续决定用户主色色相，暗色填充限制亮度和色度；语义填充也使用较低的亮度和色度，实心语义控件保持白字。小面积强调文字独立提高亮度以保留可读性。没有 filter 反色，图片及画布保持原色。

预览使用 `dist/test/cloud/?theme=dark`；页面中的 Appearance 可以切换 Light、Dark、System，System 跟随系统变化，预览不持久化偏好。

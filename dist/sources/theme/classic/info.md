# Classic

灰米色面板、深蓝渐变标题栏、直角立体边框和紧凑字体的经典桌面主题。

普通按钮使用双层凸边；`type="tool"` 按钮在悬停时显示单层凸边，按下或选中时凹入。键盘焦点使用点线框。Desktop 和 Iconview 的选中图标带蓝色半透明叠层，名称使用深蓝底白字。内置文件和目录图案使用主题自绘资源。

在应用配置的 `themes` 中添加 `/clickgo/theme/classic`，或调用：

```ts
await clickgo.theme.setGlobal('/clickgo/theme/classic');
```

配色固定，不随 `theme.setMain()` 改变。图片、画布和应用自带图标保留原始内容色值；选中图标的叠层只在选中时显示。

Demo 的 `method` → `Library theme` 中提供 Classic 切换入口。

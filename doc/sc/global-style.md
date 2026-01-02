# 全局样式

## 变量

ClickGo 使用 CSS 变量来控制全局样式和主题。这些变量通常定义在 `#cg-wrap` 下。

### 基础颜色

- `--cg`: 主题色
- `--cg-hover`: 主题色悬停状态
- `--cg-active`: 主题色激活状态
- `--cg-focus`: 主题色焦点状态
- `--cg-disabled`: 主题色禁用状态
- `--cg-bg`: 主题色浅色背景

### 状态颜色

- `--success`: 成功颜色
- `--info`: 信息颜色
- `--warning`: 警告颜色
- `--danger`: 危险颜色
- 各状态颜色均有对应的 `-hover`、`-active`、`-focus`、`-disabled` 和 `-bg` 变体。

### 控件通用颜色

- `--g-color`: 默认文字颜色
- `--g-background`: 默认背景颜色
- `--g-border-color`: 默认边框颜色
- `--g-plain-color`: 朴素/轻量文字颜色
- `--g-plain-background`: 朴素/轻量背景颜色
- `--g-plain-border-color`: 朴素/轻量边框颜色

### 布局与间距

- `--g-padding`: 标准内边距
- `--g-padding-s`: 小内边距
- `--g-padding-xs`: 超小内边距
- `--g-padding-l`: 大内边距
- `--g-padding-xl`: 超大内边距
- `--g-margin`: 标准外边距

### 圆角

- `--g-radius`: 标准圆角
- `--g-radius-l`: 较大圆角
- `--g-radius-xl`: 超大圆角

### 字号

- `--g-size`: 标准字号
- `--g-size-xs`: 超小字号
- `--g-size-m`: 中等字号
- `--g-size-l`: 较大字号
- `--g-size-xl`: 大字号
- `--g-size-xxl`: 超大字号

### 控件尺寸

- `--g-control`: 标准控件尺寸（如 check、radio 的宽度）
- `--g-control-m`: 中等控件尺寸
- `--g-control-l`: 较大控件尺寸

### 其他

- `--g-family`: 字体族
- `--g-line`: 行高
- `--g-cubic`: 全局贝塞尔缓动函数
- `--g-transition`: 全局过渡动画
- `--g-pure`: 纯底色（通常为白色或极浅色）
- `--face`: 表面颜色
- `--g-shadow`: 阴影

## 属性选择器

- `[data-cg-disabled]`: 禁用状态，会自动设置 `cursor: not-allowed;`。

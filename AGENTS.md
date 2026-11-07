# ClickGo

`package.json.name=clickgo`；本仓库维护框架、内置控件/主题及 Demo。先读共享 [core](../kebab-site/.agents/skills/core/SKILL.md)，源码维护用 clickgo-source，应用/Demo 接入用 clickgo-app；abox/hbox/wbox 按 development-flow，hbox 写法按 code-rule。共享技能不可读时说明缺项，按本文件和当前契约继续范围内工作。

## 源码与职责边界

- `dist/` 是 TS 源码根，编译在原位生成 JS/声明；SCSS 生成 CSS，pack 生成运行时和控件/应用包。生成物不得手改，`dist/test/native/pre.js` 是手写源码。
- hbox 入口为 `dist/clickgo.ts`、`dist/lib/`，控件契约在各自 `info.md`/props/emits。框架 abox 稳定入口为 `dist/abox/{tool,command,package,form}.ts`；框架能力由调用方注入，纯风格检查由 ESLint 的 abox override 管理。
- Form 公开入口为 `dist/lib/form.ts`，类型在 `dist/lib/form/types.ts`。视图构建、浮层、通知、系统宿主及拖动效果经 `dist/abox/form.ts` 接入；宿主元素延迟读取，避免循环依赖初始化。任务退出时停止创建，销毁前释放所属浮层和监听。
- CGA 读取契约在 `dist/lib/core/package.ts`，`createPackage(blob)` 注入框架能力，由 `dist/abox/package.ts` 接入读取实现。
- 控件是独立打包边界，通过公开 clickgo API 接入框架；自身 hbox 辅助入口放控件根 `lib/`，abox 放控件根 `abox/`。
- `dist/abox/test/` 是自动回归，`dist/test/` 是浏览器/Native 宿主；测试、内部参考和 AGENTS 不随运行时发布。Native 路径及同步要求见 [联动约定](dist/abox/doc/native.md)。
- 新控件由 `dist/pack.ts` 扫描；`dist/lib/fs.ts` 的资源清单由 `dist/build.ts` 生成，资源变动后先重建清单，再编译/打包。Demo 入口需同时配置主 Form 和应用 config.json；控件配置见各自 info.md。

## 命令与 AI 接入

- 入口为 `dist/lib/command.ts`；同目录 `command/{types,data,webmcp,runtime,file}.ts` 定义契约，运行机制在 `dist/abox/command/`。行为、权限及文件读取限制见 [命令规范](doc/sc/commands.md)。
- Form/Panel 卸载及 `task.end` 清理所属命令，任务退出期间拒绝新注册和事件投递。框架发布 `window.clickgo.command`，在 `Boot.main` 前初始化 WebMCP；宿主/App 无需重复接入。页面 unsupported/ready 状态与工具发布诊断分别处理，状态通过事件传递。
- 文件交付使用 `context.createFile(blob, options)` 和 `success(data, files)`；框架按需发布 `clickgo.file.read`。文件按 App 隔离，随创建范围清理；Native 资源适配在 `dist/test/native/abox/mcp.ts`，不接受文件系统路径。
- AI 接入说明由 `command.getAgentInfo` 按实际环境生成，实例和命令通过接口发现，HTTP 凭据仅在显式授权后导出。Native 适配器按 taskId 调用 executeAgent，页面不监听协议网络，读取连接设置需 root 权限。

## 界面与资源约束

- 主题名称为 `light`、`dark` 或 `<名称>-light` / `<名称>-dark`，源码目录、配置 name、包名和加载引用一致。`dist/sources/theme/` 根目录只放主题目录，各组辅助 SCSS 收于本组 `_shared.scss`。
- Light/Dark、Modern、Software 分别共享 `light/_shared.scss`、`modern-light/_shared.scss`、`software-light/_shared.scss`；共享文件只提供函数和 mixin，各主题独立定义配色与状态、独立打包。`cloud-dark` 复用 `cloud-light` 的排版与尺寸，色阶独立；Cloud 和 Dashboard 的主色跟随 `theme.setMain`。
- 主题定义控件皮肤与尺寸，页面留白和业务布局由消费应用决定；Group 留白由 padding 参数控制。Nav 的 `menu-header`/`menu-footer` 位于菜单滚动区外，Nav-item 的 `suffix` 不计入子菜单。
- Desktop 的 positions 是保存布局，layout.positions 是区域约束后的显示布局；缩放不得覆盖保存坐标。应用负责文件操作、壁纸和持久化。参数/置底示例在 `dist/app/demo/form/{control,solution}/desktop/`。
- Desktop/Iconview 通过 Pointer.js 处理可取消拖动，携带 fs 载荷、data-drop 和 iframe move hooks；销毁、禁用或取消时不投递 drop。Form 的 viewport、padding="safe" 与 refreshMaxPosition 由控件管理几何。
- Demo 文案使用英文；框架界面按 locale 显示并回退英文，语言表覆盖 tool.lang.codes 全部语种。Select 本地列表按完整数据校验，远程缺项保留已选值并补标签。
- Breadcrumb/Breadcrumb-item、Accordion/Accordion-item、Objviewer/Objviewer-item 分别同包，打包关系在 `dist/pack.ts`，控件契约在各自 info.md。Objviewer 使用稳定节点 ID 连线并复用 Panzoom；Cube 为独立固定尺寸 SVG 标识。

## 构建与验收

- 脚本以 package.json 为准。先执行 `node node_modules/typescript/bin/tsc`；涉及 SCSS 时按 package.json 的 Sass 配置编译，再执行 `node dist/pack.js`。pack 会捕获部分错误，需核实控件数量、应用结果和真实归档。
- `npm run check` 覆盖类型、lint 和主要回归；Native 改动另跑 `test:native`，包变更跑 `test:archive`。Select 包验收使用 `CLICKGO_SELECT_TEST_ARCHIVE=1 npm run test:select`；`npm pack --dry-run` 检查声明依赖及发布排除项，abox 运行代码须进入打包产物。
- 文件交付的 Electron 链路用 `electron dist/abox/test/native-command-file-electron.mjs` 验证；`CLICKGO_NATIVE_FILE_ENTRY` 指定待验收的 Native 入口。测试使用临时用户目录、打包的命令 Demo 和官方 MCP 客户端。
- 浏览器入口 `dist/test/desktop/` 要求安全上下文及可加载依赖。类型、回归、浏览器和真实 Native 验收分别报告。

专项浏览器宿主：

| 入口 | 用途与参数 |
|---|---|
| `dist/test/date/` | Demo 日期示例；`control=date\|datepanel\|daterange`、`theme=<主题包名>`、`lang=<语言码>`；启动前刷新同址控件和 Demo 包缓存 |
| `dist/test/showcase/` | 文档 pic2 的英文后台演示；源码在自身 `app/`，pack 输出同目录 `app.cga`；使用 dashboard-light 和固定数据，无业务后台 |
| `dist/test/cloud/` | Cloud 原生控件预览；`?theme=dark` 以暗色启动，支持 Light/Dark/System；应用包由 pack 生成 |
| `dist/test/accordion/` | 复用 Demo Form；支持 `theme=<主题包名>` 和 `rtl` |
| `dist/test/objviewer/` | 复用 Demo Form，验证布局、过滤、动态节点及窄视口；使用系统当前主题与主题色 |

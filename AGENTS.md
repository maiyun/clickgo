# ClickGo

`package.json.name=clickgo`；本仓库维护框架、内置控件/主题及 Demo。先读共享 [core](../kebab-site/.agents/skills/core/SKILL.md)，源码用 clickgo-source，应用/Demo 接入按需用 clickgo-app；abox/hbox/wbox 用 development-flow，hbox 写法用 code-rule。共享技能不可读时说明缺项，按本文件和当前契约继续范围内工作。

## 源码与 abox/hbox/wbox

- `dist/` 是 TS 源码根，编译在原位生成 JS/声明；SCSS 生成 CSS，pack 生成运行时和控件/应用包，禁止手改生成物。`dist/test/native/pre.js` 是手写源码例外。
- wbox：架构及接口行为规范；hbox：`dist/clickgo.ts`、`dist/lib/` 的公开声明与可审阅流程，控件 `info.md`/props/emits。契约和关键决策留在 abox 外。
- CGA 读取的边界与能力参数说明在 `dist/lib/core/package.ts`；主流程调用 createPackage(blob)，该入口统一接入框架能力，abox/package 只实现读取。
- 命令公开契约在 `dist/lib/command/types.ts`，数据校验、浏览器发布及运行时能力契约在同目录的 `{data,webmcp,runtime}.ts`；command.ts 的 hbox 区只保留公开入口与明确调用，原 API 路径不变。注册表、内部 IEntry、权限/取消执行机制、文件交付及发布实现位于 `dist/abox/command/runtime.ts`，框架机制由入口注入；行为规范及权限默认值仍以公开声明和 `doc/sc/commands.md` 为准。
- abox：`dist/abox/{tool,command,package}.ts` 是稳定能力入口；运行实现只依赖公共能力/类型，所需外部机制由调用方传入。内部组织、写法及实现注释由 AI 决定，类型/正确性检查仍执行；纯风格豁免由 ESLint 的 abox override 管理。
- 控件是独立打包边界，内部实现放控件根的 `abox/`；Desktop 为 `dist/sources/control/desktop/abox/layout.ts`，hbox 入口在同控件 `lib/layout.ts`。控件通过公开 clickgo API 接入框架，不跨目录引用框架私有实现。
- 自动回归在 `dist/abox/test/`，允许作为消费者调用公开入口；不发布测试、内部参考和 AGENTS。`dist/test/` 是浏览器/Native 宿主，保留资源 URL 与同步路径约定。
- 新控件由 `dist/pack.ts` 扫描；`dist/lib/fs.ts` 资源清单由 `dist/build.ts` 生成，资源变动后重建清单再编译/打包；应用 config.json 与控件 info.md 需分别核对。Demo 入口在主 Form 与应用配置中同步。

## 稳定行为

- Desktop 的 positions 是用户保存布局，layout.positions 是区域约束后的显示布局；缩放不能覆盖保存坐标。应用负责文件操作、壁纸和持久化。参数/置底 Demo 分别在 `dist/app/demo/form/{control,solution}/desktop/`。
- Desktop/Iconview 使用 Pointer.js 可取消 drag；保持 fs 载荷、data-drop 和 iframe move hooks，销毁/禁用/取消不投递 drop。Form 的 viewport、padding="safe" 与 refreshMaxPosition 委托控件管理几何，不手写全屏尺寸。
- 命令执行入口为 `dist/lib/command.ts`；Form/Panel 卸载及 task.end 清理对应命令，退出等待拒绝新注册。框架自动发布 window.clickgo.command 并在 Boot.main 前初始化页面 WebMCP；宿主/App 不重复接入。页面 unsupported/ready 与工具发布诊断分开，状态事件不轮询，退出后不投递。
- 命令文件契约和 hbox 入口在 `dist/lib/command/file.ts`，缓存、容量/到期校验、分段读取及释放实现位于 `dist/abox/command/file.ts`，计时器与编码机制由入口注入。用 `context.createFile(已生成 Blob, options)` 和 `success(data, files)` 交付；通用读取名称 `clickgo.file.read` 由框架保留并按需发布。文件按 App 隔离并随创建范围清理，限制与读取契约见 `doc/sc/commands.md`。Native 资源适配在测试宿主 `abox/mcp.ts`，不接受文件系统路径。
- AI 接入说明仅由 command.getAgentInfo 的实际环境生成；临时实例/命令快照由接口发现，HTTP 凭据只显式授权导出。Native 适配器按 taskId 调用 executeAgent；页面不监听协议网络，读取连接设置沿用 root 检查。Native 改动读 [联动约定](dist/abox/doc/native.md)。
- Demo 文案沿用英文；框架界面用当前 locale 和英文回退，语言表覆盖 tool.lang.codes 全部语种。Select 本地列表按完整数据校验，远程缺项保留已选值并补标签。

## 生成与验证

脚本以 package.json 为准：先 `node node_modules/typescript/bin/tsc`；改 SCSS 时按原 Sass 流程编译，再 `node dist/pack.js`。pack 会捕获部分错误，须核实控件数量、应用结果和真实归档。

- `npm run check` 覆盖类型/lint 和主要回归；Native 改动另跑 test:native。
- 文件交付的真实 Electron 链路用 `electron dist/abox/test/native-command-file-electron.mjs`；设置 `CLICKGO_NATIVE_FILE_ENTRY` 可验证同步后的 Native 主入口。测试使用临时用户目录和打包的真实命令 Demo，通过官方 MCP 客户端操作。
- 包变更跑 test:archive；Select 包验收用 `CLICKGO_SELECT_TEST_ARCHIVE=1 npm run test:select`。npm pack --dry-run 检查 abox 运行代码、声明依赖与发布排除项。
- 浏览器入口 `dist/test/desktop/` 要求安全上下文及可加载依赖。类型、回归、浏览器与真实 Native 验收分别报告；Native 同步流程见联动约定。
- `dist/test/showcase/` 是文档 pic2 的英文后台独立演示；应用源码在其 `app/`，`dist/pack.ts` 输出同目录 `app.cga`。使用原生控件和 `dashboard` 主题；实例 SCSS 只定义内容区尺寸。使用固定演示数据，没有业务后台；搜索、周期选择、菜单选中和强调色切换可操作。
- `dashboard` 主题在 `dist/sources/theme/dashboard/`，主色跟随 `theme.setMain`。Nav 的 `menu-header`/`menu-footer` 在菜单滚动区外；Nav-item 的 `suffix` 不计入子菜单。无新插槽的 Nav 保留原有 DOM 结构。
- `cloud` / `cloud-dark` 为 CF 风格的浅色/暗色主题；暗色复用 cloud 的排版与尺寸并独立设计色阶。主色跟随 `theme.setMain`。独立原生控件预览在 `dist/test/cloud/`，`?theme=dark` 以暗色启动，Appearance 支持 Light/Dark/System；应用包由 pack 生成。
- Breadcrumb 独立包包含 Breadcrumb-item；最后一项按直属 DOM 顺序自动成为当前位置，选择事件不执行导航。打包关系在 `dist/pack.ts`，动态重排、禁用和销毁回归用 `test:breadcrumb`。
- Objviewer 与 Objviewer-item 同包，连线使用稳定节点 ID；hbox 布局入口在控件 `lib/layout.ts`，几何与布局实现位于自身 `abox/`，视口复用 Panzoom。旧 DOM 端点 API 已移除，公开契约见两者 info.md；`test:objviewer` 验证布局、节点生命周期及选择。
- Cube 为独立固定尺寸 SVG 标识，不参与空间几何或动画回调。独立预览 `dist/test/objviewer/` 使用 Demo 包中的同一 Form，支持布局、过滤、动态节点与窄视口；Form 和独立入口沿用系统当前主题与主题色，不主动加载主题。测试首页及 Demo 的 Objviewer + Cube 均可进入。

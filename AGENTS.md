# ClickGo

`package.json.name=clickgo`；本仓库维护框架、内置控件/主题及 Demo。先读共享 [core](../kebab-site/.agents/skills/core/SKILL.md)，源码用 clickgo-source，应用/Demo 接入按需用 clickgo-app；三箱用 development-flow，白/灰箱写法用 code-rule。共享技能不可读时说明缺项，按本文件和当前契约继续范围内工作。

## 源码与三箱

- `dist/` 是 TS 源码根，编译在原位生成 JS/声明；SCSS 生成 CSS，pack 生成运行时和控件/应用包，禁止手改生成物。`dist/test/native/pre.js` 是手写源码例外。
- 白箱：`dist/clickgo.ts`、`dist/lib/` 的公开声明，控件 `info.md`/props/emits；灰箱：框架生命周期、权限、注册/清理及控件交互流程。契约和关键决策留在 abox 外。
- CGA 读取的边界与能力参数说明在 `dist/lib/core/package.ts`；主流程调用 createPackage(blob)，该入口统一接入框架能力，abox/package 只实现读取。
- 命令的数据校验和浏览器发布契约在 `dist/lib/command/{data,webmcp}.ts`，实现经 abox/command 接入；command.ts 保留注册范围、公开筛选、权限、执行占用及销毁决策。
- 黑箱：`dist/abox/{tool,command,package}.ts` 是稳定能力入口；运行实现只依赖公共能力/类型，所需外部机制由调用方传入。内部组织、写法及实现注释由 AI 决定，类型/正确性检查仍执行；纯风格豁免由 ESLint 的 abox override 管理。
- 控件是独立打包边界，内部黑箱放控件根的 `abox/`；Desktop 为 `dist/sources/control/desktop/abox/layout.ts`，白箱入口在同控件 `lib/layout.ts`。控件通过公开 clickgo API 接入框架，不跨目录引用框架私有实现。
- 自动回归在 `dist/abox/test/`，允许作为消费者调用公开入口；不发布测试、内部参考和 AGENTS。`dist/test/` 是浏览器/Native 宿主，保留资源 URL 与同步路径约定。
- 新控件由 `dist/pack.ts` 扫描；`dist/lib/fs.ts` 资源清单由 `dist/build.ts` 生成，资源变动后重建清单再编译/打包；应用 config.json 与控件 info.md 需分别核对。Demo 入口在主 Form 与应用配置中同步。

## 稳定行为

- Desktop 的 positions 是用户保存布局，layout.positions 是区域约束后的显示布局；缩放不能覆盖保存坐标。应用负责文件操作、壁纸和持久化。参数/置底 Demo 分别在 `dist/app/demo/form/{control,solution}/desktop/`。
- Desktop/Iconview 使用 Pointer.js 可取消 drag；保持 fs 载荷、data-drop 和 iframe move hooks，销毁/禁用/取消不投递 drop。Form 的 viewport、padding="safe" 与 refreshMaxPosition 委托控件管理几何，不手写全屏尺寸。
- 命令执行入口为 `dist/lib/command.ts`；Form/Panel 卸载及 task.end 清理对应命令，退出等待拒绝新注册。框架自动发布 window.clickgo.command 并在 Boot.main 前初始化页面 WebMCP；宿主/App 不重复接入。页面 unsupported/ready 与工具发布诊断分开，状态事件不轮询，退出后不投递。
- AI 接入说明仅由 command.getAgentInfo 的实际环境生成；临时实例/命令快照由接口发现，HTTP 凭据只显式授权导出。Native 适配器按 taskId 调用 executeAgent；页面不监听协议网络，读取连接设置沿用 root 检查。Native 改动读 [联动约定](dist/abox/doc/native.md)。
- Demo 文案沿用英文；框架界面用当前 locale 和英文回退，语言表覆盖 tool.lang.codes 全部语种。Select 本地列表按完整数据校验，远程缺项保留已选值并补标签。

## 生成与验证

脚本以 package.json 为准：先 `node node_modules/typescript/bin/tsc`；改 SCSS 时按原 Sass 流程编译，再 `node dist/pack.js`。pack 会捕获部分错误，须核实控件数量、应用结果和真实归档。

- `npm run check` 覆盖类型/lint 和主要回归；Native 改动另跑 test:native。
- 包变更跑 test:archive；Select 包验收用 `CLICKGO_SELECT_TEST_ARCHIVE=1 npm run test:select`。npm pack --dry-run 检查黑箱运行代码、声明依赖与发布排除项。
- 浏览器入口 `dist/test/desktop/` 要求安全上下文及可加载依赖。类型、回归、浏览器与真实 Native 验收分别报告；Native 同步流程见联动约定。

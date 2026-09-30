# ClickGo 框架工作区

本仓库是 `clickgo` 框架及其内置控件、主题和示例应用。

- 开发规则先读取 kebab-site 提供的 `core`、`clickgo-app`、`code-rule` 技能及 ClickGo 源码维护参考。
- 实际 TypeScript 源码位于 `dist/`。同目录的 `.js`、`.d.ts`、`.css`、`.pack.js` 和 `.cgc`/`.cga` 是生成物，使用编译或打包生成。
- 新增独立控件时，`dist/pack.ts` 自动扫描控件目录；同时检查 `dist/lib/fs.ts` 的资源清单、消费应用 `config.json` 和控件 `info.md`，三者不会自动同步。
- `dist/sources/control/desktop/lib/layout.ts` 是无 DOM 的有限区域布局逻辑；Desktop 的 `positions` 保存用户布局，`layout.positions` 是窗口约束后的临时显示布局，缩放不能覆盖持久化位置。应用负责文件操作、壁纸和持久化。
- Desktop 与 Iconview 共用 `modules.pointer.drag()`；Pointer.js 管理可取消会话、指示器和最上层落点，通过既有 move hooks 同步 iframe 遮罩。保持 pointer 的 fs 载荷及 data-drop 协议兼容，销毁、禁用或取消时不投递 drop。
- 桌面控件的参数 demo 在 `dist/app/demo/form/control/desktop/`；置底实战 Form 在 `dist/app/demo/form/solution/desktop/`。添加 demo 时同步主 Form 的入口和应用控件配置。
- Form 的 `viewport` 和 `padding="safe"` 由控件管理布局边界与内容安全区；首次最大化与 `form.refreshMaxPosition()` 统一委托控件刷新，桌面 demo 不手工维护全屏尺寸。
- 验证使用 `npm run check`；位置、指针取消和双向绑定回归使用 `npm run test:desktop`。先用 `npx tsc` 更新生成的运行时代码，再运行依赖该代码的测试。
- 控件 SCSS 使用已有全局 Sass 命令编译，随后运行 `node dist/pack.js`。打包器部分错误会被捕获，必须确认对应控件数量和应用结果，并检查归档内容；需要时执行 `npm run test:archive`。
- 浏览器入口为 `dist/test/desktop/`；安全上下文和可加载的运行时依赖是有效验收的前提。区分类型、单元回归、浏览器与 Native 桌面验证。

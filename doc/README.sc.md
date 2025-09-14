# ClickGo

<p align="center"><img src="../dist/icon.png" width="68" height="68" alt="ClickGo"></p>
<p align="center">
    <a href="https://github.com/maiyun/clickgo/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/github/license/maiyun/clickgo?color=blue" />
    </a>
    <a href="https://www.npmjs.com/package/clickgo">
        <img alt="NPM stable version" src="https://img.shields.io/npm/v/clickgo?color=brightgreen&logo=npm" />
    </a>
    <a href="https://github.com/maiyun/clickgo/releases">
        <img alt="GitHub releases" src="https://img.shields.io/github/v/release/maiyun/clickgo?color=brightgreen&logo=github" />
    </a>
    <a href="https://github.com/maiyun/clickgo/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/maiyun/clickgo?color=blue&logo=github" />
    </a>
</p>

使用 HTML + CSS 构建 Web、Native 应用。

应用编译为 cga 单文件，可以在 Web 中运行，也可以借助 [ClickGo Native](https://github.com/maiyun/clickgo-native) 在本地系统运行。可编写图像编辑器、数据库管理工具、文件浏览器等应用软件，也可编写后台管理面板。

<p align="center">
    <img src="./pic3.jpg" alt="ClickGo">
    <img src="./pic.jpg" alt="ClickGo">
    <img src="./pic2.jpg" alt="ClickGo">
</p>

## 使用

需要借助 [ClickGo Compiler](https://github.com/maiyun/clickgo-compiler) 将 app 文件夹编译为 cga 文件，然后编译入口文件，并在浏览器中引用入口文件。

**index.html**

```html
<script type="module" src="index.pack.js"></script>
```

**index.js**

```typescript
import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    public async main(): Promise<void> {
        await clickgo.task.run(this._sysId, 'xxx.cga');
    }
}
clickgo.launcher(new Boot());
```

### NPM

TypeScript 环境下，在使用 NPM 安装后，您将得到代码提示。

```sh
$ npm i clickgo --save-dev
$ npm i jszip --save-dev
$ npm i vue --save-dev
```

## 注意

ClickGo 会自动加载 Vue、jszip 库，所以**请勿**引用这些库的 JS 和 CSS 文件。

## 示例

克隆代码并访问 "dist/test/index.html"。

[点击这里在线访问](https://maiyun.github.io/clickgo/dist/test/)

## 许可

ClickGo 基于 [Apache-2.0](./LICENSE) 协议发布。
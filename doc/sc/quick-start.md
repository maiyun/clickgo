# 快速开始

## 安装

首先设置 ClickGo 模块的加载路径，然后使用 script 模块加载。

**index.html**

```html
<script type="importmap">
{
    "imports": {
        "clickgo": "https://cdn.jsdelivr.net/npm/clickgo@x.x.x/dist/index.js"
    }
}
</script>
<script type="module" src="index.js"></script>
```

也可以携带参数和全局变量。

```html
<script>
clickgo = {
    'config': {
        'cdn': 'https://cdn.jsdelivr.net',
    },
    'global': {},
};
</script>
```

**index.js**

```ts
import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    public async main(): Promise<void> {
        // --- 运行应用，例如运行一个 cga 文件 ---
        await clickgo.task.run(this._sysId, 'xxx.cga');
    }
}
clickgo.launcher(new Boot());
```

## Native 持久存储

App 使用 `native.storage` 或 `native.secret` 前，在 `config.json` 中设置固定 `id`，例如 `"id": "net.example.notepad"`。ID 应唯一，移动目录、改名或升级时保持不变；同一 ID 的多个实例共用存储，不同 ID 分开。

调用方式仍为 `clickgo.native.storage.set(this, 'preferences', value)`，无需 root。缺少或非法 ID 时读写返回 `false`；`secret.isAvailable(this)` 查询系统能力，不要求 ID。完整用法见 Demo 的 **Library native**。

## 代码提示

安装 ClickGo 模块后，即可获得代码提示。

```sh
$ npm i clickgo --save-dev
$ npm i jszip --save-dev
$ npm i vue --save-dev
```

## 注意

ClickGo 会自动加载 Vue、jszip 库，所以**请勿**在 HTML 中手动引用这些库的 JS 和 CSS 文件。

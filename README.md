# ClickGo

<p align="center"><img src="dist/icon.png" width="68" height="68" alt="ClickGo"></p>
<p align="center">
    <a href="https://github.com/maiyun/clickgo/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/github/license/maiyun/clickgo.svg?color=blue" />
    </a>
    <a href="https://www.npmjs.com/package/clickgo">
        <img alt="NPM stable version" src="https://img.shields.io/npm/v/clickgo.svg?color=brightgreen&logo=npm" />
        <img alt="NPM beta version" src="https://img.shields.io/npm/v/clickgo/beta.svg?color=yellowgreen&logo=npm" />
        <img alt="NPM development version" src="https://img.shields.io/npm/v/clickgo/dev.svg?color=yellow&logo=npm" />
    </a><br>
    <a href="https://github.com/maiyun/clickgo/releases">
        <img alt="GitHub releases" src="https://img.shields.io/github/release/maiyun/clickgo.svg?color=brightgreen&logo=github" />
        <img alt="GitHub pre-releases" src="https://img.shields.io/github/release/maiyun/clickgo/all.svg?color=yellow&logo=github" />
    </a>
    <a href="https://github.com/maiyun/clickgo/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/maiyun/clickgo.svg?color=blue&logo=github" />
    </a>
</p>

Quickly and easily create a beautiful console interface.

## Installation

Load the module loader first, and then load it using the module loader.

**index.html**

```html
<script src="https://cdn.jsdelivr.net/npm/@litert/loader@3.4.9/dist/loader.min.js?path=index&npm={'clickgo':'3.1.10-beta'}"></script>
```

**index.js**

```typescript
import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    public async main(): Promise<void> {
        await clickgo.task.run('xxx');
    }
}
clickgo.launcher(new Boot());
```

### NPM

You can install directly using NPM:

```sh
$ npm i clickgo --save
```

Or install the developing (unstable) version for newest features:

```sh
$ npm i clickgo@dev --save
```

## Note

ClickGo demand loading Vue, jszip, resize-observer, but **DO NOT** reference these JS and CSS files. ClickGo will automatically reference. You only need to import "clickgo" module.

## Demo

Clone and visit "dist/test/index.html".

[Click here to visit online.](https://maiyunnet.github.io/ClickGo/dist/test/)

## Changelog

[Changelog](doc/CHANGELOG.md)

## License

This library is published under [Apache-2.0](./LICENSE) license.
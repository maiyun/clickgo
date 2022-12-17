# ClickGo

<p align="center"><img src="dist/icon.png" width="100" height="100" alt="ClickGo"></p>

[![npm version](https://img.shields.io/npm/v/clickgo.svg?colorB=brightgreen)](https://www.npmjs.com/package/clickgo "Stable Version")
[![npm version](https://img.shields.io/npm/v/clickgo/dev.svg)](https://www.npmjs.com/package/clickgo "Development Version")
[![npm version](https://img.shields.io/npm/v/clickgo/beta.svg)](https://www.npmjs.com/package/clickgo "Beta Version")
[![License](https://img.shields.io/github/license/maiyun/clickgo.svg)](https://github.com/maiyun/clickgo/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/maiyun/clickgo.svg)](https://github.com/maiyun/clickgo/issues)
[![GitHub Releases](https://img.shields.io/github/release/maiyun/clickgo.svg)](https://github.com/maiyun/clickgo/releases "Stable Release")
[![GitHub Pre-Releases](https://img.shields.io/github/release/maiyun/clickgo/all.svg)](https://github.com/maiyun/clickgo/releases "Pre-Release")

Quickly and easily create a beautiful console interface.

## Installation

Load the module loader first, and then load it using the module loader.

**index.html**

```html
<script src="https://cdn.jsdelivr.net/npm/@litert/loader@3.4.3/dist/loader.min.js?path=index&npm={'clickgo':'3.1.4-dev13'}"></script>
```

**index.js**

```typescript
import * as clickgo from 'clickgo';
(async function() {
    await clickgo.init();
    await clickgo.task.run('xxx');
})().catch((e) => {
    console.log(e);
});
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
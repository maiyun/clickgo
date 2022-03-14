# ClickGo

[![npm version](https://img.shields.io/npm/v/clickgo.svg?colorB=brightgreen)](https://www.npmjs.com/package/clickgo "Stable Version")
[![npm version](https://img.shields.io/npm/v/clickgo/dev.svg)](https://www.npmjs.com/package/clickgo "Development Version")
[![npm version](https://img.shields.io/npm/v/clickgo/beta.svg)](https://www.npmjs.com/package/clickgo "Beta Version")
[![License](https://img.shields.io/github/license/MaiyunNET/ClickGo.svg)](https://github.com/MaiyunNET/ClickGo/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/MaiyunNET/ClickGo.svg)](https://github.com/MaiyunNET/ClickGo/issues)
[![GitHub Releases](https://img.shields.io/github/release/MaiyunNET/ClickGo.svg)](https://github.com/MaiyunNET/ClickGo/releases "Stable Release")
[![GitHub Pre-Releases](https://img.shields.io/github/release/MaiyunNET/ClickGo/all.svg)](https://github.com/MaiyunNET/ClickGo/releases "Pre-Release")

Quickly and easily create a beautiful console interface.

## Installation

Simply download and include with a script tag. ClickGo will be registered as a global variable.

> Don't use the minified version during development. You will miss out on all the nice warnings for common mistakes!

**Development Version**

```html
<script src="index.js"></script>
```

**Production Version**

```html
<script src="index.min.js"></script>
```

### CDN (recommend)

Recommended: https://cdn.jsdelivr.net/npm/clickgo@3.0.0/dist/index.min.js (Less than 3kb minified and gzipped), which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at https://cdn.jsdelivr.net/npm/clickgo/.

Also available on [unpkg](https://unpkg.com/clickgo@3.0.0/dist/index.js).

For example:

```html
<script src="https://cdn.jsdelivr.net/npm/clickgo@3.0.0/dist/index.min.js"></script>
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

ClickGo demand loading Vue, jszip, resize-observer, but **DO NOT** reference these JS and CSS files. ClickGo will automatically reference. You only need to reference "index.js".

## Demo

Clone and visit "dist/test/index.html".

[Click here to visit online.](https://maiyunnet.github.io/ClickGo/dist/test/)

## Changelog

[Changelog](doc/CHANGELOG.md)

## License

This library is published under [Apache-2.0](./LICENSE) license.
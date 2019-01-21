# DeskRT

[![npm version](https://img.shields.io/npm/v/deskrt.svg?colorB=brightgreen)](https://www.npmjs.com/package/deskrt "Stable Version")
[![npm version](https://img.shields.io/npm/v/deskrt/dev.svg)](https://www.npmjs.com/package/deskrt "Development Version")
[![License](https://img.shields.io/github/license/MaiyunNET/DeskRT.svg)](https://github.com/MaiyunNET/DeskRT/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/MaiyunNET/DeskRT.svg)](https://github.com/MaiyunNET/DeskRT/issues)
[![GitHub Releases](https://img.shields.io/github/release/MaiyunNET/DeskRT.svg)](https://github.com/MaiyunNET/DeskRT/releases "Stable Release")
[![GitHub Pre-Releases](https://img.shields.io/github/release/MaiyunNET/DeskRT/all.svg)](https://github.com/MaiyunNET/DeskRT/releases "Pre-Release")

Quickly and easily create a beautiful console interface.

# Installation

Simply download and include with a script tag. DeskRT will be registered as a global variable.

> Don’t use the minified version during development. You will miss out on all the nice warnings for common mistakes!

**Development Version**

```html
<script src="dist/deskrt.js"></script>
<link rel="stylesheet" href="dist/deskrt.css">
```

**Production Version**

```html
<script src="dist/deskrt.min.js"></script>
<link rel="stylesheet" href="dist/deskrt.css">
```

## CDN (recommend)

Recommended: https://cdn.jsdelivr.net/npm/deskrt, which will reflect the latest version as soon as it is published to npm. You can also browse the source of the npm package at https://cdn.jsdelivr.net/npm/deskrt/.

Also available on [unpkg](https://unpkg.com/deskrt).

For example:

```html
<script src="https://cdn.jsdelivr.net/npm/deskrt@1.0.0/dist/deskrt.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/deskrt@1.0.0/dist/deskrt.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/deskrt@1.0.0/dist/theme/blue/index.css">
```

## NPM

You can install directly using NPM:

```sh
$ npm i deskrt --save
```

Or install the developing (unstable) version for newest features:

```sh
$ npm i deskrt@dev --save
```

# Note

DeskRT demand loading SystemJS, Vue, Vuex, highlight.js, whatwg-fetch, promise-polyfill and ElementUI, but **DO NOT** reference these JS and CSS files. DeskRT will automatically reference. You only need to reference DeskRT's JS and CSS files.

# Test

Test in the browser, visit "dist/test/index.html".

[Click here to visit online.](https://maiyunnet.github.io/DeskRT/dist/test/)

# License

This library is published under [Apache-2.0](./LICENSE) license.
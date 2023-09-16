# ClickGo

<p align="center"><img src="dist/icon.png" width="68" height="68" alt="ClickGo"></p>
<p align="center">
    <a href="https://github.com/maiyun/clickgo/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/github/license/maiyun/clickgo?color=blue" />
    </a>
    <a href="https://www.npmjs.com/package/clickgo">
        <img alt="NPM stable version" src="https://img.shields.io/npm/v/clickgo?color=brightgreen&logo=npm" />
        <img alt="NPM beta version" src="https://img.shields.io/npm/v/clickgo/beta?color=yellowgreen&logo=npm" />
        <img alt="NPM development version" src="https://img.shields.io/npm/v/clickgo/dev?color=yellow&logo=npm" />
    </a><br>
    <a href="https://github.com/maiyun/clickgo/releases">
        <img alt="GitHub releases" src="https://img.shields.io/github/v/release/maiyun/clickgo?color=brightgreen&logo=github" />
        <img alt="GitHub pre-releases" src="https://img.shields.io/github/v/release/maiyun/clickgo?color=yellow&logo=github&include_prereleases" />
    </a>
    <a href="https://github.com/maiyun/clickgo/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/maiyun/clickgo?color=blue&logo=github" />
    </a>
</p>

Quickly and easily create a beautiful console interface.

## Installation

Load the module loader first, and then load it using the module loader.

**index.html**

```html
<script src="https://cdn.jsdelivr.net/npm/@litert/loader@3.5.0/dist/loader.min.js?path=index&npm={'clickgo':'3.5.5'}"></script>
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

## Third-party licenses

### **LICENSE:** MIT License **AUTHOR:** sigurdarson

#### Form

[Minus SVG Vector](https://www.svgrepo.com/svg/447026/minus)  
[Copy SVG Vector](https://www.svgrepo.com/svg/446994/copy)  
[Border Radius SVG Vector](https://www.svgrepo.com/svg/446973/border-radius)  
[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

#### Greatlist

[Document Remove SVG](https://www.svgrepo.com/svg/447002/document-remove)

#### Menulist Item

[Check SVG Vector](https://www.svgrepo.com/svg/446979/check)

#### Nav

[Menu SVG Vector](https://www.svgrepo.com/svg/447023/menu)

#### Page

[More Horizontal SVG Vector](https://www.svgrepo.com/svg/447028/more-horizontal)

### **LICENSE:** MIT License **AUTHOR:** developmentseed

#### Map

[Marker SVG Vector](https://www.svgrepo.com/svg/379072/marker)

### **LICENSE:** CC Attribution License **AUTHOR:** Solar Icons

#### Property

[Siderbar SVG Vector](https://www.svgrepo.com/svg/529875/siderbar)  
[Sort By Alphabet SVG Vector](https://www.svgrepo.com/svg/529901/sort-by-alphabet)  
[Notification Unread Lines SVG](https://www.svgrepo.com/svg/529113/notification-unread-lines)  
[Bolt SVG Vector](https://www.svgrepo.com/svg/528871/bolt)

### **LICENSE:** CC0 License **UPLOADER:** SVG Repo

#### Iconview

[Folder SVG Vector](https://www.svgrepo.com/svg/474852/folder)
[File SVG Vector](https://www.svgrepo.com/svg/474842/file)
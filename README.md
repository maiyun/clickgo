# ClickGo

<p align="center"><img src="./dist/icon.png" width="68" height="68" alt="ClickGo"></p>
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

[简体中文](./doc/README.sc.md)

Build web and native apps using HTML + CSS.

Apps compile into a single `.cga` file — run it in the browser or locally via `ClickGo Native`. Great for image editors, DB tools, file managers, admin panels, and more.

<p align="center">
    <img src="./doc/pic3.jpg" alt="ClickGo">
    <img src="./doc/pic.jpg" alt="ClickGo">
    <img src="./doc/pic2.jpg" alt="ClickGo">
</p>

## Usage

First, load the module loader, then load your app with it.

**index.html**

```html
<script src="https://cdn.jsdelivr.net/npm/@litert/loader@3.5.8/dist/loader.min.js?path=index&npm={'clickgo':'3.16.21'}"></script>
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

Use TypeScript? Install via NPM for full IntelliSense support.

```sh
$ npm i clickgo --save-dev
$ npm i @litert/loader --save-dev
$ npm i jszip --save-dev
```

## Notes

ClickGo auto-loads Vue, jszip, and resize-observer.
**Don't** include them manually — just import the `ClickGo` module.

## Demo

Clone and visit "dist/test/index.html".

[Click here to visit online.](https://maiyun.github.io/clickgo/dist/test/)

## License

This library is published under [Apache-2.0](./LICENSE) license.

## Third-party licenses

#### Empty

<a href="https://www.flaticon.com/free-icons/empty" title="empty icons">Empty icons created by Ghozi Muhtarom - Flaticon</a>

#### Greatlist

<a href="https://www.flaticon.com/free-icons/empty" title="empty icons">Empty icons created by Ghozi Muhtarom - Flaticon</a>

#### Img

<a href="https://www.flaticon.com/free-icons/no-photo" title="no photo icons">No photo icons created by kerismaker - Flaticon</a>

#### Icon

<a href="https://www.flaticon.com/free-icons/identity" title="identity icons">Identity icons created by Ghozi Muhtarom - Flaticon</a>  
<a href="https://www.flaticon.com/free-icons/truck" title="truck icons">Truck icons created by Freepik - Flaticon</a>

### **LICENSE:** MIT License **AUTHOR:** sigurdarson

#### Delete

[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

#### Tag

[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

#### Date

[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

#### Daterange

[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

#### Drawer

[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

#### Form

[Minus SVG Vector](https://www.svgrepo.com/svg/447026/minus)  
[Copy SVG Vector](https://www.svgrepo.com/svg/446994/copy)  
[Border Radius SVG Vector](https://www.svgrepo.com/svg/446973/border-radius)  
[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

#### Levelselect

[Key Up SVG Vector](https://www.svgrepo.com/svg/447022/key-up)

#### Menulist Item

[Check SVG Vector](https://www.svgrepo.com/svg/446979/check)

#### Nav

[Menu SVG Vector](https://www.svgrepo.com/svg/447023/menu)

#### Page

[More Horizontal SVG Vector](https://www.svgrepo.com/svg/447028/more-horizontal)

#### Arteditor

[Plus SVG Vector](https://www.svgrepo.com/svg/447037/plus)

#### Uploader

[Plus SVG Vector](https://www.svgrepo.com/svg/447037/plus)
[Trash SVG Vector](https://www.svgrepo.com/svg/447040/trash)

#### Video

[Play SVG Vector](https://www.svgrepo.com/svg/447035/play)  
[Pause SVG Vector](https://www.svgrepo.com/svg/447033/pause)  
[Border Radius SVG Vector](https://www.svgrepo.com/svg/446973/border-radius)  
[Copy SVG Vector](https://www.svgrepo.com/svg/446994/copy)

#### Mpegts

[Play SVG Vector](https://www.svgrepo.com/svg/447035/play)  
[Pause SVG Vector](https://www.svgrepo.com/svg/447033/pause)  
[Border Radius SVG Vector](https://www.svgrepo.com/svg/446973/border-radius)  
[Copy SVG Vector](https://www.svgrepo.com/svg/446994/copy)  
[Speaker 2 SVG Vector](https://www.svgrepo.com/svg/506329/speaker-2)  
[Speaker Cross SVG Vector](https://www.svgrepo.com/show/506328/speaker-cross.svg)

#### Select

[Close SVG Vector](https://www.svgrepo.com/svg/446990/close)

### **LICENSE:** CC Attribution License **AUTHOR:** krystonschwarze

#### Uploader

[Drag Vertical SVG Vector](https://www.svgrepo.com/svg/510958/drag-vertical)

### **LICENSE:** MIT License **AUTHOR:** developmentseed

#### Map

[Marker SVG Vector](https://www.svgrepo.com/svg/379072/marker)

### **LICENSE:** CC Attribution License **AUTHOR:** Solar Icons

#### Property

[Siderbar SVG Vector](https://www.svgrepo.com/svg/529875/siderbar)  
[Sort By Alphabet SVG Vector](https://www.svgrepo.com/svg/529901/sort-by-alphabet)  
[Notification Unread Lines SVG](https://www.svgrepo.com/svg/529113/notification-unread-lines)  
[Bolt SVG Vector](https://www.svgrepo.com/svg/528871/bolt)

### Icon

[Question Circle SVG Vector](https://www.svgrepo.com/svg/522997/question-circle)  
[Info Circle SVG Vector](https://www.svgrepo.com/svg/522904/info-circle)
[Copy SVG Vector](https://www.svgrepo.com/svg/522803/copy)
[Scissors SVG Vector](https://www.svgrepo.com/svg/523012/scissors)
[Paste SVG Vector](https://www.svgrepo.com/svg/489767/paste)

### **LICENSE:** CC0 License **UPLOADER:** SVG Repo

#### Iconview

[Folder SVG Vector](https://www.svgrepo.com/svg/474852/folder)  
[File SVG Vector](https://www.svgrepo.com/svg/474842/file)

### **LICENSE:** MIT License **AUTHOR:** instructure-ui

#### Arteditor

[Bold SVG Vector](https://www.svgrepo.com/svg/501109/bold)  
[Italic SVG Vector](https://www.svgrepo.com/svg/501238/italic)

### **LICENSE:** CC Attribution License **AUTHOR:** Dazzle UI

#### Text

[Eye Slash Alt SVG](https://www.svgrepo.com/svg/532463/eye-slash-alt)  
[Eye Alt SVG Vector ](https://www.svgrepo.com/svg/532492/eye-alt)
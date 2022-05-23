"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const zip = require("jszip");
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
function addFile(zipo, base = '', path = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield fs.promises.readdir(base + path, {
            'withFileTypes': true
        });
        for (const item of list) {
            const p = base + path + item.name;
            if (item.isFile()) {
                if (item.name.endsWith('.ts')) {
                    continue;
                }
                if (item.name.endsWith('.scss')) {
                    continue;
                }
                const file = yield fs.promises.readFile(p);
                if (item.name.endsWith('.html')) {
                    zipo.file(path + item.name, purify(file.toString()));
                }
                else {
                    zipo.file(path + item.name, file);
                }
            }
            else if (item.isDirectory()) {
                yield addFile(zipo, base, path + item.name + '/');
            }
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let list = yield fs.promises.readdir('dist/sources/control/', {
            'withFileTypes': true
        });
        for (const item of list) {
            if (item.isFile()) {
                continue;
            }
            if (['check', 'dialog', 'file', 'greatlist', 'greatselect', 'greatview', 'img', 'label', 'layout', 'list', 'marquee', 'menu', 'menu-item', 'menulist', 'menulist-item', 'menulist-split', 'overflow', 'radio', 'scroll', 'select', 'tab', 'text', 'view', 'task-item'].includes(item.name)) {
                continue;
            }
            const zipo = new zip();
            const base = 'dist/sources/control/';
            let name = item.name;
            yield addFile(zipo, base, item.name + '/');
            if (item.name === 'button') {
                name = 'common';
                yield addFile(zipo, base, 'check/');
                yield addFile(zipo, base, 'dialog/');
                yield addFile(zipo, base, 'file/');
                yield addFile(zipo, base, 'greatlist/');
                yield addFile(zipo, base, 'greatselect/');
                yield addFile(zipo, base, 'greatview/');
                yield addFile(zipo, base, 'img/');
                yield addFile(zipo, base, 'label/');
                yield addFile(zipo, base, 'layout/');
                yield addFile(zipo, base, 'list/');
                yield addFile(zipo, base, 'marquee/');
                yield addFile(zipo, base, 'menu/');
                yield addFile(zipo, base, 'menu-item/');
                yield addFile(zipo, base, 'menulist/');
                yield addFile(zipo, base, 'menulist-item/');
                yield addFile(zipo, base, 'menulist-split/');
                yield addFile(zipo, base, 'overflow/');
                yield addFile(zipo, base, 'radio/');
                yield addFile(zipo, base, 'scroll/');
                yield addFile(zipo, base, 'select/');
                yield addFile(zipo, base, 'tab/');
                yield addFile(zipo, base, 'text/');
                yield addFile(zipo, base, 'view/');
            }
            else if (item.name === 'task') {
                yield addFile(zipo, base, 'task-item/');
            }
            yield fs.promises.writeFile('dist/control/' + name + '.cgc', yield zipo.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            }));
        }
        const base = 'dist/sources/theme/';
        list = yield fs.promises.readdir('dist/sources/theme/', {
            'withFileTypes': true
        });
        for (const item of list) {
            if (item.isFile()) {
                continue;
            }
            const zipo = new zip();
            yield addFile(zipo, base + item.name + '/');
            yield fs.promises.writeFile('dist/theme/' + item.name + '.cgt', yield zipo.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            }));
        }
    });
}
run().catch(function (e) {
    console.log(e);
});

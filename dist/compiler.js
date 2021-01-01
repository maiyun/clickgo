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
    text = text.replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
function addFile(zipo, base = '', path = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let list = yield fs.promises.readdir(base + path, {
            'withFileTypes': true
        });
        for (let item of list) {
            let p = base + path + item.name;
            if (item.isFile()) {
                if (item.name.endsWith('.d.ts')) {
                    continue;
                }
                let file = yield fs.promises.readFile(p);
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
        for (let item of list) {
            if (item.isFile()) {
                continue;
            }
            if (['greatselect-list', 'greatselect-list-item', 'greatselect-list-split', 'img', 'label', 'layout', 'menu-item', 'menu-list-item', 'menu-list-split', 'overflow', 'tab-nav', 'tab-panel'].includes(item.name)) {
                continue;
            }
            let zipo = new zip();
            let base = 'dist/sources/control/';
            let name = item.name;
            yield addFile(zipo, base, item.name + '/');
            if (item.name === 'block') {
                name = 'common';
                yield addFile(zipo, base, 'img/');
                yield addFile(zipo, base, 'label/');
                yield addFile(zipo, base, 'layout/');
                yield addFile(zipo, base, 'overflow/');
            }
            else if (item.name === 'greatselect') {
                yield addFile(zipo, base, 'greatselect-list/');
                yield addFile(zipo, base, 'greatselect-list-item/');
                yield addFile(zipo, base, 'greatselect-list-split/');
            }
            else if (item.name === 'menu') {
                yield addFile(zipo, base, 'menu-item/');
            }
            else if (item.name === 'menu-list') {
                yield addFile(zipo, base, 'menu-list-item/');
                yield addFile(zipo, base, 'menu-list-split/');
            }
            else if (item.name === 'tab') {
                yield addFile(zipo, base, 'tab-nav/');
                yield addFile(zipo, base, 'tab-panel/');
            }
            yield fs.promises.writeFile('dist/control/' + name + '.cgc', yield zipo.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            }));
        }
        let base = 'dist/sources/theme/';
        list = yield fs.promises.readdir('dist/sources/theme/', {
            'withFileTypes': true
        });
        for (let item of list) {
            if (item.isFile()) {
                continue;
            }
            let zipo = new zip();
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

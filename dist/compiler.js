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
        let config;
        try {
            const c = yield fs.promises.readFile(base + '/config.json', 'utf8');
            config = JSON.parse(c);
        }
        catch (e) {
            console.log('[ERROR]', e);
            return;
        }
        zipo.file(path + (path ? '/' : '') + 'config.json', JSON.stringify(config));
        for (const file of config.files) {
            const p = base + file;
            const buf = yield fs.promises.readFile(p);
            const bfile = path ? file : file.slice(1);
            if (file.endsWith('.html')) {
                zipo.file(path + bfile, purify(buf.toString()));
            }
            else {
                zipo.file(path + bfile, buf);
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
            if (['check', 'dialog', 'file', 'greatlist', 'greatselect', 'greatview', 'img', 'label', 'layout', 'list', 'loading', 'marquee', 'menu', 'menu-item', 'menulist', 'menulist-item', 'menulist-split', 'overflow', 'radio', 'scroll', 'select', 'tab', 'text', 'view', 'task-item'].includes(item.name)) {
                continue;
            }
            if (item.name.startsWith('.')) {
                continue;
            }
            const zipo = new zip();
            const base = 'dist/sources/control/';
            let name = item.name;
            yield addFile(zipo, base + item.name, item.name);
            if (item.name === 'button') {
                name = 'common';
                yield addFile(zipo, base + 'check', 'check');
                yield addFile(zipo, base + 'dialog', 'dialog');
                yield addFile(zipo, base + 'file', 'file');
                yield addFile(zipo, base + 'greatlist', 'greatlist');
                yield addFile(zipo, base + 'greatselect', 'greatselect');
                yield addFile(zipo, base + 'greatview', 'greatview');
                yield addFile(zipo, base + 'img', 'img');
                yield addFile(zipo, base + 'label', 'label');
                yield addFile(zipo, base + 'layout', 'layout');
                yield addFile(zipo, base + 'list', 'list');
                yield addFile(zipo, base + 'loading', 'loading');
                yield addFile(zipo, base + 'marquee', 'marquee');
                yield addFile(zipo, base + 'menu', 'menu');
                yield addFile(zipo, base + 'menu-item', 'menu-item');
                yield addFile(zipo, base + 'menulist', 'menulist');
                yield addFile(zipo, base + 'menulist-item', 'menulist-item');
                yield addFile(zipo, base + 'menulist-split', 'menulist-split');
                yield addFile(zipo, base + 'overflow', 'overflow');
                yield addFile(zipo, base + 'radio', 'radio');
                yield addFile(zipo, base + 'scroll', 'scroll');
                yield addFile(zipo, base + 'select', 'select');
                yield addFile(zipo, base + 'tab', 'tab');
                yield addFile(zipo, base + 'text', 'text');
                yield addFile(zipo, base + 'view', 'view');
            }
            else if (item.name === 'task') {
                yield addFile(zipo, base + 'task-item', 'task-item');
            }
            const buf = yield zipo.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            });
            yield fs.promises.writeFile('dist/control/' + name + '.cgc', buf);
        }
        list = yield fs.promises.readdir('dist/sources/theme/', {
            'withFileTypes': true
        });
        for (const item of list) {
            if (item.name.startsWith('.')) {
                continue;
            }
            const zipo = new zip();
            const base = 'dist/sources/theme/' + item.name;
            yield addFile(zipo, base);
            const buf = yield zipo.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            });
            yield fs.promises.writeFile('dist/theme/' + item.name + '.cgt', buf);
        }
    });
}
run().catch(function (e) {
    console.log(e);
});

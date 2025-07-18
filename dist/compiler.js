"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const jszip_1 = __importDefault(require("jszip"));
const terser = __importStar(require("terser"));
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
function addFile(zipo_1) {
    return __awaiter(this, arguments, void 0, function* (zipo, base = '', path = '') {
        var _a;
        const list = yield fs.promises.readdir(base);
        for (const item of list) {
            try {
                const stat = yield fs.promises.lstat(base + '/' + item);
                if (stat.isDirectory()) {
                    yield addFile(zipo, base + '/' + item, path + (path ? '/' : '') + item);
                    continue;
                }
                if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.scss')) {
                    continue;
                }
                const buf = yield fs.promises.readFile(base + '/' + item);
                if (item.endsWith('.html') || item.endsWith('.xml')) {
                    zipo.file(path + (path ? '/' : '') + item, purify(buf.toString()));
                }
                else if (item.endsWith('.js')) {
                    const rtn = yield terser.minify(buf.toString());
                    zipo.file(path + (path ? '/' : '') + item, (_a = rtn.code) !== null && _a !== void 0 ? _a : '');
                }
                else {
                    zipo.file(path + (path ? '/' : '') + item, buf);
                }
            }
            catch (_b) {
                continue;
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
            if (['bgroup', 'alert', 'alayout', 'alayout-row', 'alayout-cell', 'alayout2', 'alayout2-cell', 'grid', 'grid-cell', 'check', 'circle', 'content', 'dialog', 'file', 'greatlist', 'greatselect', 'group', 'html', 'vflow', 'video', 'img', 'imgviewer', 'label', 'layout', 'hske', 'icon', 'levelselect', 'list', 'loading', 'marquee', 'menu', 'menu-item', 'menulist', 'menulist-item', 'menulist-split', 'flow', 'radio', 'scroll', 'select', 'sgroup', 'step', 'svg', 'switch', 'arrow', 'tab', 'tag', 'text', 'tip', 'title', 'task-item', 'table-item', 'nav-item', 'nav-title', 'panel', 'desc-cell', 'desc-head', 'desc-row', 'link', 'date', 'daterange', 'progress', 'datepanel', 'empty', 'palette', 'colorist', 'uploader', 'setting', 'setting-item', 'delete', 'timeline', 'timeline-item', 'number', 'web'].includes(item.name)) {
                continue;
            }
            if (item.name.startsWith('.')) {
                continue;
            }
            const zipo = new jszip_1.default();
            const base = 'dist/sources/control/';
            let name = item.name;
            yield addFile(zipo, base + item.name, item.name);
            if (item.name === 'button') {
                name = 'common';
                yield addFile(zipo, base + 'bgroup', 'bgroup');
                yield addFile(zipo, base + 'alert', 'alert');
                yield addFile(zipo, base + 'alayout', 'alayout');
                yield addFile(zipo, base + 'alayout-row', 'alayout-row');
                yield addFile(zipo, base + 'alayout-cell', 'alayout-cell');
                yield addFile(zipo, base + 'alayout2', 'alayout2');
                yield addFile(zipo, base + 'alayout2-cell', 'alayout2-cell');
                yield addFile(zipo, base + 'grid', 'grid');
                yield addFile(zipo, base + 'grid-cell', 'grid-cell');
                yield addFile(zipo, base + 'check', 'check');
                yield addFile(zipo, base + 'circle', 'circle');
                yield addFile(zipo, base + 'content', 'content');
                yield addFile(zipo, base + 'dialog', 'dialog');
                yield addFile(zipo, base + 'file', 'file');
                yield addFile(zipo, base + 'greatlist', 'greatlist');
                yield addFile(zipo, base + 'greatselect', 'greatselect');
                yield addFile(zipo, base + 'group', 'group');
                yield addFile(zipo, base + 'html', 'html');
                yield addFile(zipo, base + 'vflow', 'vflow');
                yield addFile(zipo, base + 'video', 'video');
                yield addFile(zipo, base + 'img', 'img');
                yield addFile(zipo, base + 'imgviewer', 'imgviewer');
                yield addFile(zipo, base + 'label', 'label');
                yield addFile(zipo, base + 'layout', 'layout');
                yield addFile(zipo, base + 'hske', 'hske');
                yield addFile(zipo, base + 'icon', 'icon');
                yield addFile(zipo, base + 'levelselect', 'levelselect');
                yield addFile(zipo, base + 'list', 'list');
                yield addFile(zipo, base + 'loading', 'loading');
                yield addFile(zipo, base + 'marquee', 'marquee');
                yield addFile(zipo, base + 'menu', 'menu');
                yield addFile(zipo, base + 'menu-item', 'menu-item');
                yield addFile(zipo, base + 'menulist', 'menulist');
                yield addFile(zipo, base + 'menulist-item', 'menulist-item');
                yield addFile(zipo, base + 'menulist-split', 'menulist-split');
                yield addFile(zipo, base + 'flow', 'flow');
                yield addFile(zipo, base + 'radio', 'radio');
                yield addFile(zipo, base + 'scroll', 'scroll');
                yield addFile(zipo, base + 'select', 'select');
                yield addFile(zipo, base + 'sgroup', 'sgroup');
                yield addFile(zipo, base + 'step', 'step');
                yield addFile(zipo, base + 'svg', 'svg');
                yield addFile(zipo, base + 'switch', 'switch');
                yield addFile(zipo, base + 'arrow', 'arrow');
                yield addFile(zipo, base + 'tab', 'tab');
                yield addFile(zipo, base + 'tag', 'tag');
                yield addFile(zipo, base + 'text', 'text');
                yield addFile(zipo, base + 'tip', 'tip');
                yield addFile(zipo, base + 'title', 'title');
                yield addFile(zipo, base + 'panel', 'panel');
                yield addFile(zipo, base + 'link', 'link');
                yield addFile(zipo, base + 'date', 'date');
                yield addFile(zipo, base + 'daterange', 'daterange');
                yield addFile(zipo, base + 'progress', 'progress');
                yield addFile(zipo, base + 'datepanel', 'datepanel');
                yield addFile(zipo, base + 'empty', 'empty');
                yield addFile(zipo, base + 'palette', 'palette');
                yield addFile(zipo, base + 'colorist', 'colorist');
                yield addFile(zipo, base + 'uploader', 'uploader');
                yield addFile(zipo, base + 'setting', 'setting');
                yield addFile(zipo, base + 'setting-item', 'setting-item');
                yield addFile(zipo, base + 'delete', 'delete');
                yield addFile(zipo, base + 'timeline', 'timeline');
                yield addFile(zipo, base + 'timeline-item', 'timeline-item');
                yield addFile(zipo, base + 'number', 'number');
                yield addFile(zipo, base + 'web', 'web');
            }
            else if (item.name === 'task') {
                yield addFile(zipo, base + 'task-item', 'task-item');
            }
            else if (item.name === 'table') {
                yield addFile(zipo, base + 'table-item', 'table-item');
            }
            else if (item.name === 'nav') {
                yield addFile(zipo, base + 'nav-item', 'nav-item');
                yield addFile(zipo, base + 'nav-title', 'nav-title');
            }
            else if (item.name === 'desc') {
                yield addFile(zipo, base + 'desc-cell', 'desc-cell');
                yield addFile(zipo, base + 'desc-head', 'desc-head');
                yield addFile(zipo, base + 'desc-row', 'desc-row');
            }
            const buf = yield zipo.generateAsync({
                'type': 'nodebuffer',
                'compression': 'DEFLATE',
                'compressionOptions': {
                    'level': 9
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
            const zipo = new jszip_1.default();
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

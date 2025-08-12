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
async function addFile(zipo, base = '', path = '') {
    const list = await fs.promises.readdir(base);
    for (const item of list) {
        try {
            const stat = await fs.promises.lstat(base + '/' + item);
            if (stat.isDirectory()) {
                await addFile(zipo, base + '/' + item, path + (path ? '/' : '') + item);
                continue;
            }
            if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.scss')) {
                continue;
            }
            const buf = await fs.promises.readFile(base + '/' + item);
            if (item.endsWith('.html') || item.endsWith('.xml')) {
                zipo.file(path + (path ? '/' : '') + item, purify(buf.toString()));
            }
            else if (item.endsWith('.js')) {
                const rtn = await terser.minify(buf.toString());
                zipo.file(path + (path ? '/' : '') + item, rtn.code ?? '');
            }
            else {
                zipo.file(path + (path ? '/' : '') + item, buf);
            }
        }
        catch {
            continue;
        }
    }
}
async function run() {
    let list = await fs.promises.readdir('dist/sources/control/', {
        'withFileTypes': true
    });
    for (const item of list) {
        if (['bgroup', 'alert', 'alayout', 'alayout-row', 'alayout-cell', 'alayout2', 'alayout2-cell', 'grid', 'grid-cell', 'check', 'circle', 'content', 'dialog', 'file', 'greatlist', 'greatselect', 'group', 'html', 'vflow', 'video', 'img', 'imgviewer', 'label', 'layout', 'hske', 'icon', 'levelselect', 'list', 'loading', 'marquee', 'menu', 'menu-item', 'menulist', 'menulist-item', 'menulist-split', 'flow', 'radio', 'scroll', 'select', 'sgroup', 'step', 'svg', 'switch', 'arrow', 'tab', 'tag', 'text', 'tip', 'title', 'task-item', 'table-item', 'nav-item', 'nav-title', 'panel', 'desc-cell', 'desc-head', 'desc-row', 'link', 'date', 'daterange', 'progress', 'datepanel', 'calendar', 'empty', 'palette', 'colorist', 'uploader', 'setting', 'setting-item', 'delete', 'timeline', 'timeline-item', 'number', 'web'].includes(item.name)) {
            continue;
        }
        if (item.name.startsWith('.')) {
            continue;
        }
        const zipo = new jszip_1.default();
        const base = 'dist/sources/control/';
        let name = item.name;
        await addFile(zipo, base + item.name, item.name);
        if (item.name === 'button') {
            name = 'common';
            await addFile(zipo, base + 'bgroup', 'bgroup');
            await addFile(zipo, base + 'alert', 'alert');
            await addFile(zipo, base + 'alayout', 'alayout');
            await addFile(zipo, base + 'alayout-row', 'alayout-row');
            await addFile(zipo, base + 'alayout-cell', 'alayout-cell');
            await addFile(zipo, base + 'alayout2', 'alayout2');
            await addFile(zipo, base + 'alayout2-cell', 'alayout2-cell');
            await addFile(zipo, base + 'grid', 'grid');
            await addFile(zipo, base + 'grid-cell', 'grid-cell');
            await addFile(zipo, base + 'check', 'check');
            await addFile(zipo, base + 'circle', 'circle');
            await addFile(zipo, base + 'content', 'content');
            await addFile(zipo, base + 'dialog', 'dialog');
            await addFile(zipo, base + 'file', 'file');
            await addFile(zipo, base + 'greatlist', 'greatlist');
            await addFile(zipo, base + 'greatselect', 'greatselect');
            await addFile(zipo, base + 'group', 'group');
            await addFile(zipo, base + 'html', 'html');
            await addFile(zipo, base + 'vflow', 'vflow');
            await addFile(zipo, base + 'video', 'video');
            await addFile(zipo, base + 'img', 'img');
            await addFile(zipo, base + 'imgviewer', 'imgviewer');
            await addFile(zipo, base + 'label', 'label');
            await addFile(zipo, base + 'layout', 'layout');
            await addFile(zipo, base + 'hske', 'hske');
            await addFile(zipo, base + 'icon', 'icon');
            await addFile(zipo, base + 'levelselect', 'levelselect');
            await addFile(zipo, base + 'list', 'list');
            await addFile(zipo, base + 'loading', 'loading');
            await addFile(zipo, base + 'marquee', 'marquee');
            await addFile(zipo, base + 'menu', 'menu');
            await addFile(zipo, base + 'menu-item', 'menu-item');
            await addFile(zipo, base + 'menulist', 'menulist');
            await addFile(zipo, base + 'menulist-item', 'menulist-item');
            await addFile(zipo, base + 'menulist-split', 'menulist-split');
            await addFile(zipo, base + 'flow', 'flow');
            await addFile(zipo, base + 'radio', 'radio');
            await addFile(zipo, base + 'scroll', 'scroll');
            await addFile(zipo, base + 'select', 'select');
            await addFile(zipo, base + 'sgroup', 'sgroup');
            await addFile(zipo, base + 'step', 'step');
            await addFile(zipo, base + 'svg', 'svg');
            await addFile(zipo, base + 'switch', 'switch');
            await addFile(zipo, base + 'arrow', 'arrow');
            await addFile(zipo, base + 'tab', 'tab');
            await addFile(zipo, base + 'tag', 'tag');
            await addFile(zipo, base + 'text', 'text');
            await addFile(zipo, base + 'tip', 'tip');
            await addFile(zipo, base + 'title', 'title');
            await addFile(zipo, base + 'panel', 'panel');
            await addFile(zipo, base + 'link', 'link');
            await addFile(zipo, base + 'date', 'date');
            await addFile(zipo, base + 'daterange', 'daterange');
            await addFile(zipo, base + 'progress', 'progress');
            await addFile(zipo, base + 'datepanel', 'datepanel');
            await addFile(zipo, base + 'calendar', 'calendar');
            await addFile(zipo, base + 'empty', 'empty');
            await addFile(zipo, base + 'palette', 'palette');
            await addFile(zipo, base + 'colorist', 'colorist');
            await addFile(zipo, base + 'uploader', 'uploader');
            await addFile(zipo, base + 'setting', 'setting');
            await addFile(zipo, base + 'setting-item', 'setting-item');
            await addFile(zipo, base + 'delete', 'delete');
            await addFile(zipo, base + 'timeline', 'timeline');
            await addFile(zipo, base + 'timeline-item', 'timeline-item');
            await addFile(zipo, base + 'number', 'number');
            await addFile(zipo, base + 'web', 'web');
        }
        else if (item.name === 'task') {
            await addFile(zipo, base + 'task-item', 'task-item');
        }
        else if (item.name === 'table') {
            await addFile(zipo, base + 'table-item', 'table-item');
        }
        else if (item.name === 'nav') {
            await addFile(zipo, base + 'nav-item', 'nav-item');
            await addFile(zipo, base + 'nav-title', 'nav-title');
        }
        else if (item.name === 'desc') {
            await addFile(zipo, base + 'desc-cell', 'desc-cell');
            await addFile(zipo, base + 'desc-head', 'desc-head');
            await addFile(zipo, base + 'desc-row', 'desc-row');
        }
        const buf = await zipo.generateAsync({
            'type': 'nodebuffer',
            'compression': 'DEFLATE',
            'compressionOptions': {
                'level': 9
            }
        });
        await fs.promises.writeFile('dist/control/' + name + '.cgc', buf);
    }
    list = await fs.promises.readdir('dist/sources/theme/', {
        'withFileTypes': true
    });
    for (const item of list) {
        if (item.name.startsWith('.')) {
            continue;
        }
        const zipo = new jszip_1.default();
        const base = 'dist/sources/theme/' + item.name;
        await addFile(zipo, base);
        const buf = await zipo.generateAsync({
            'type': 'nodebuffer',
            'compression': 'DEFLATE',
            'compressionOptions': {
                'level': 9,
            }
        });
        await fs.promises.writeFile('dist/theme/' + item.name + '.cgt', buf);
    }
}
run().catch(function (e) {
    console.log(e);
});

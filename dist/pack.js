import * as rollup from 'rollup';
import * as fs from 'fs';
import * as terser from 'terser';
import * as lCompiler from './compiler/compiler.js';
// -----------
// --- 插件 ---
// -----------
/** --- 压缩 --- */
function terserPlugin() {
    return {
        'name': 'pre-terser',
        generateBundle: async function (options, bundle) {
            for (const [, chunkOrAsset] of Object.entries(bundle)) {
                if (chunkOrAsset.type !== 'chunk') {
                    continue;
                }
                const result = await terser.minify(chunkOrAsset.code);
                chunkOrAsset.code = result.code ?? '';
            }
        }
    };
}
// -------------------------
// --- 先编译 ClickGo 核心 ---
// -------------------------
const clickgoBundle = await rollup.rollup({
    'input': './dist/clickgo.js',
    'plugins': [
        terserPlugin(),
    ],
    'onwarn': (warning, warn) => {
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
        }
        warn(warning);
    },
});
await clickgoBundle.write({
    'file': './dist/index.js',
    'format': 'es',
});
await clickgoBundle.close();
// ---------------
// --- 编译控件 ---
// ---------------
let list = await fs.promises.readdir('dist/sources/control/', {
    'withFileTypes': true,
});
for (const item of list) {
    if (item.name.startsWith('.')) {
        continue;
    }
    if (['bgroup', 'alert', 'alayout', 'alayout-row', 'alayout-cell', 'alayout2', 'alayout2-cell', 'grid', 'grid-cell', 'check', 'circle', 'content', 'dialog', 'file', 'greatlist', 'greatselect', 'group', 'html', 'vflow', 'video', 'img', 'imgviewer', 'label', 'layout', 'hske', 'icon', 'levelselect', 'list', 'loading', 'marquee', 'menu', 'menu-item', 'menulist', 'menulist-item', 'menulist-split', 'flow', 'radio', 'scroll', 'select', 'sgroup', 'step', 'svg', 'switch', 'arrow', 'tab', 'tag', 'text', 'tip', 'title', 'task-item', 'table-item', 'nav-item', 'nav-title', 'panel', 'desc-cell', 'desc-head', 'desc-row', 'link', 'date', 'daterange', 'progress', 'datepanel', 'calendar', 'empty', 'palette', 'colorist', 'uploader', 'setting', 'setting-item', 'delete', 'timeline', 'timeline-item', 'number', 'web', 'objviewer-item'].includes(item.name)) {
        continue;
    }
    try {
        const base = 'dist/sources/control/';
        /** --- 最终打包的文件名 --- */
        let name = item.name;
        /** --- 最终要打包的 --- */
        const paths = [
            base + item.name,
        ];
        if (item.name === 'button') {
            name = 'common';
            paths.push(base + 'bgroup');
            paths.push(base + 'alert');
            paths.push(base + 'alayout');
            paths.push(base + 'alayout-row');
            paths.push(base + 'alayout-cell');
            paths.push(base + 'alayout2');
            paths.push(base + 'alayout2-cell');
            paths.push(base + 'grid');
            paths.push(base + 'grid-cell');
            paths.push(base + 'check');
            paths.push(base + 'circle');
            paths.push(base + 'content');
            paths.push(base + 'dialog');
            paths.push(base + 'file');
            paths.push(base + 'greatlist');
            paths.push(base + 'greatselect');
            paths.push(base + 'group');
            paths.push(base + 'html');
            paths.push(base + 'vflow');
            paths.push(base + 'video');
            paths.push(base + 'img');
            paths.push(base + 'imgviewer');
            paths.push(base + 'label');
            paths.push(base + 'layout');
            paths.push(base + 'hske');
            paths.push(base + 'icon');
            paths.push(base + 'levelselect');
            paths.push(base + 'list');
            paths.push(base + 'loading');
            paths.push(base + 'marquee');
            paths.push(base + 'menu');
            paths.push(base + 'menu-item');
            paths.push(base + 'menulist');
            paths.push(base + 'menulist-item');
            paths.push(base + 'menulist-split');
            paths.push(base + 'flow');
            paths.push(base + 'radio');
            paths.push(base + 'scroll');
            paths.push(base + 'select');
            paths.push(base + 'sgroup');
            paths.push(base + 'step');
            paths.push(base + 'svg');
            paths.push(base + 'switch');
            paths.push(base + 'arrow');
            paths.push(base + 'tab');
            paths.push(base + 'tag');
            paths.push(base + 'text');
            paths.push(base + 'tip');
            paths.push(base + 'title');
            paths.push(base + 'panel');
            paths.push(base + 'link');
            paths.push(base + 'date');
            paths.push(base + 'daterange');
            paths.push(base + 'progress');
            paths.push(base + 'datepanel');
            paths.push(base + 'calendar');
            paths.push(base + 'empty');
            paths.push(base + 'palette');
            paths.push(base + 'colorist');
            paths.push(base + 'uploader');
            paths.push(base + 'setting');
            paths.push(base + 'setting-item');
            paths.push(base + 'delete');
            paths.push(base + 'timeline');
            paths.push(base + 'timeline-item');
            paths.push(base + 'number');
            paths.push(base + 'web');
        }
        else if (item.name === 'task') {
            paths.push(base + 'task-item');
        }
        else if (item.name === 'table') {
            paths.push(base + 'table-item');
        }
        else if (item.name === 'nav') {
            paths.push(base + 'nav-item');
            paths.push(base + 'nav-title');
        }
        else if (item.name === 'desc') {
            paths.push(base + 'desc-cell');
            paths.push(base + 'desc-head');
            paths.push(base + 'desc-row');
        }
        else if (item.name === 'objviewer') {
            paths.push(base + 'objviewer-item');
        }
        /** --- 控件个数 --- */
        const number = await lCompiler.control(paths, 'dist/control/' + name);
        console.log('CONTROL', `[${name}]`, number);
    }
    catch {
        continue;
    }
}
// --- 编译测试控件 ---
const cnumber = await lCompiler.control([
    'dist/test/control'
], 'dist/app/demo/res/');
console.log('CONTROL', `[custombtn]`, cnumber);
// ---------------
// --- 编译主题 ---
// ---------------
list = await fs.promises.readdir('dist/sources/theme/', {
    'withFileTypes': true,
});
for (const item of list) {
    if (item.name.startsWith('.')) {
        continue;
    }
    const result = await lCompiler.theme('dist/sources/theme/' + item.name, 'dist/theme/');
    console.log('THEME', `[${item.name}]`, result);
}
// ---------------
// --- 编译应用---
// ---------------
const taskApp = await lCompiler.application('dist/app/task');
console.log('APPLICATION', `[task]`, taskApp);
const demoApp = await lCompiler.application('dist/app/demo');
console.log('APPLICATION', `[demo]`, demoApp);
const cgaApp = await lCompiler.application('dist/test/cga/app', 'dist/test/cga/icon.png');
console.log('APPLICATION', `[cga]`, cgaApp);

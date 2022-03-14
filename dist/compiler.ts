import * as fs from 'fs';
import * as zip from 'jszip';

// --- sass --watch dist/:dist/ --style compressed --no-source-map ---
// --- git config core.ignorecase false ---

/**
 * --- 去除 html 的空白符、换行 ---
 * @param text 要纯净的字符串
 */
function purify(text: string): string {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function(t: string, t1: string) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}

async function addFile(zipo: zip, base: string = '', path: string = ''): Promise<void> {
    let list = await fs.promises.readdir(base + path, {
        'withFileTypes': true
    });
    for (let item of list) {
        let p = base + path + item.name;
        if (item.isFile()) {
            if (item.name.endsWith('.ts')) {
                continue;
            }
            if (item.name.endsWith('.scss')) {
                continue;
            }
            let file = await fs.promises.readFile(p);
            if (item.name.endsWith('.html')) {
                zipo.file(path + item.name, purify(file.toString()));
            }
            else {
                zipo.file(path + item.name, file);
            }
        }
        else if (item.isDirectory()) {
            await addFile(zipo, base, path + item.name + '/');
        }
    }
}

async function run(): Promise<void> {
    // --- control to cgc ---
    let list = await fs.promises.readdir('dist/sources/control/', {
        'withFileTypes': true
    });
    for (let item of list) {
        if (item.isFile()) {
            continue;
        }
        if (['button', 'check', 'dialog', 'greatlist', 'greatselect', 'greatview', 'img', 'label', 'layout', 'list', 'menu', 'menu-item', 'menulist', 'menulist-item', 'menulist-split', 'overflow', 'radio', 'scroll', 'select', 'tab', 'tab-panel', 'text', 'view', 'task-item'].includes(item.name)) {
            continue;
        }

        let zipo = new zip();
        let base = 'dist/sources/control/';
        let name = item.name;

        await addFile(zipo, base, item.name + '/');

        if (item.name === 'block') {
            name = 'common';
            await addFile(zipo, base, 'button/');
            await addFile(zipo, base, 'check/');
            await addFile(zipo, base, 'dialog/');
            await addFile(zipo, base, 'greatlist/');
            await addFile(zipo, base, 'greatselect/');
            await addFile(zipo, base, 'greatview/');
            await addFile(zipo, base, 'img/');
            await addFile(zipo, base, 'label/');
            await addFile(zipo, base, 'layout/');
            await addFile(zipo, base, 'list/');
            await addFile(zipo, base, 'menu/');
            await addFile(zipo, base, 'menu-item/');
            await addFile(zipo, base, 'menulist/');
            await addFile(zipo, base, 'menulist-item/');
            await addFile(zipo, base, 'menulist-split/');
            await addFile(zipo, base, 'overflow/');
            await addFile(zipo, base, 'radio/');
            await addFile(zipo, base, 'scroll/');
            await addFile(zipo, base, 'select/');
            await addFile(zipo, base, 'tab/');
            await addFile(zipo, base, 'tab-panel/');
            await addFile(zipo, base, 'text/');
            await addFile(zipo, base, 'view/');
        }
        else if (item.name === 'task') {
            await addFile(zipo, base, 'task-item/');
        }

        await fs.promises.writeFile('dist/control/' + name + '.cgc', await zipo.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        }));
    }
    // --- theme to cgt ---
    let base = 'dist/sources/theme/';

    list = await fs.promises.readdir('dist/sources/theme/', {
        'withFileTypes': true
    });
    for (let item of list) {
        if (item.isFile()) {
            continue;
        }

        let zipo = new zip();
        await addFile(zipo, base + item.name + '/');

        // --- 组成 cgt 文件 ---
        await fs.promises.writeFile('dist/theme/' + item.name + '.cgt', await zipo.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        }));
    }
}
run().catch(function(e) {
    console.log(e);
});

import * as fs from 'fs';
import * as zip from 'jszip';

/**
 * --- 去除 html 的空白符、换行 ---
 * @param text 要纯净的字符串
 */
function purify(text: string): string {
    text = '>' + text + '<';
    text = text.replace(/>([\s\S]*?)</g, function(t: string, t1: string) {
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
            if (item.name.endsWith('.d.ts')) {
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
        if (['greatselect-list', 'greatselect-list-item', 'greatselect-list-split', 'img', 'label', 'layout', 'menu-item', 'menu-list-item', 'menu-list-split', 'overflow', 'tab-nav', 'tab-panel'].includes(item.name)) {
            continue;
        }

        let zipo = new zip();
        let base = 'dist/sources/control/';
        let name = item.name;

        await addFile(zipo, base, item.name + '/');

        if (item.name === 'block') {
            name = 'common';
            await addFile(zipo, base, 'img/');
            await addFile(zipo, base, 'label/');
            await addFile(zipo, base, 'layout/');
            await addFile(zipo, base, 'overflow/');
        }
        else if (item.name === 'greatselect') {
            await addFile(zipo, base, 'greatselect-list/');
            await addFile(zipo, base, 'greatselect-list-item/');
            await addFile(zipo, base, 'greatselect-list-split/');
        }
        else if (item.name === 'menu') {
            await addFile(zipo, base, 'menu-item/');
        }
        else if (item.name === 'menu-list') {
            await addFile(zipo, base, 'menu-list-item/');
            await addFile(zipo, base, 'menu-list-split/');
        }
        else if (item.name === 'tab') {
            await addFile(zipo, base, 'tab-nav/');
            await addFile(zipo, base, 'tab-panel/');
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

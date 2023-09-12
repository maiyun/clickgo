import * as fs from 'fs';
// import * as crypto from 'crypto';
import zip from 'jszip';
import * as terser from 'terser';

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

/**
 * --- 添加包含 config.json 的包文件到 zip ---
 * @param zipo zip 对象，不以 / 结尾
 * @param base 包含 config 的路径
 * @param path zip 中的路径基，不以 / 结尾
 */
async function addFile(zipo: zip, base: string = '', path: string = ''): Promise<void> {
    const list = await fs.promises.readdir(base);
    for (const item of list) {
        try {
            const stat = await fs.promises.lstat(base + '/' + item);
            if (stat.isDirectory()) {
                await addFile(zipo, base + '/' + item, path + (path ? '/' : '') + item);
                continue;
            }
            if (item.endsWith('.ts') || item.endsWith('.scss')) {
                continue;
            }
            const buf = await fs.promises.readFile(base + '/' + item);
            if (item.endsWith('.html')) {
                // --- 为了去除 html 中的空白和注释 ---
                zipo.file(path + (path ? '/' : '') + item, purify(buf.toString()));
            }
            else if (item.endsWith('.js')) {
                // --- 压缩 js ---
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

async function run(): Promise<void> {
    // --- control to cgc ---
    let list = await fs.promises.readdir('dist/sources/control/', {
        'withFileTypes': true
    });
    for (const item of list) {
        if (['alayout', 'alayout-row', 'alayout-cell', 'check', 'dialog', 'file', 'greatlist', 'greatselect', 'vflow', 'img', 'label', 'layout', 'list', 'loading', 'marquee', 'menu', 'menu-item', 'menulist', 'menulist-item', 'menulist-split', 'flow', 'radio', 'scroll', 'select', 'svg', 'tab', 'text', 'task-item', 'table-item', 'nav-item', 'nav-title', 'panel', 'desc-cell', 'desc-head', 'desc-row', 'link', 'date'].includes(item.name)) {
            continue;
        }
        if (item.name.startsWith('.')) {
            continue;
        }

        const zipo = new zip();
        const base = 'dist/sources/control/';
        let name = item.name;
        await addFile(zipo, base + item.name, item.name);

        if (item.name === 'button') {
            name = 'common';
            await addFile(zipo, base + 'alayout', 'alayout');
            await addFile(zipo, base + 'alayout-row', 'alayout-row');
            await addFile(zipo, base + 'alayout-cell', 'alayout-cell');
            await addFile(zipo, base + 'check', 'check');
            await addFile(zipo, base + 'dialog', 'dialog');
            await addFile(zipo, base + 'file', 'file');
            await addFile(zipo, base + 'greatlist', 'greatlist');
            await addFile(zipo, base + 'greatselect', 'greatselect');
            await addFile(zipo, base + 'vflow', 'vflow');
            await addFile(zipo, base + 'img', 'img');
            await addFile(zipo, base + 'label', 'label');
            await addFile(zipo, base + 'layout', 'layout');
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
            await addFile(zipo, base + 'svg', 'svg');
            await addFile(zipo, base + 'tab', 'tab');
            await addFile(zipo, base + 'text', 'text');
            await addFile(zipo, base + 'panel', 'panel');
            await addFile(zipo, base + 'link', 'link');
            await addFile(zipo, base + 'date', 'date');
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
        // const sha256 = Buffer.from(crypto.createHash('sha256').update(buf).digest('hex'));
        // buf = Buffer.concat([buf.slice(0, 1), sha256.slice(0, 32), buf.slice(1, -2), sha256.slice(32), buf.slice(-2)]);
        await fs.promises.writeFile('dist/control/' + name + '.cgc', buf);
    }
    // --- theme to cgt ---
    list = await fs.promises.readdir('dist/sources/theme/', {
        'withFileTypes': true
    });
    for (const item of list) {
        if (item.name.startsWith('.')) {
            continue;
        }
        const zipo = new zip();
        const base = 'dist/sources/theme/' + item.name;
        await addFile(zipo, base);

        const buf = await zipo.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        });
        // const sha256 = Buffer.from(crypto.createHash('sha256').update(buf).digest('hex'));
        // buf = Buffer.concat([buf.slice(0, 1), sha256.slice(0, 32), buf.slice(1, -2), sha256.slice(32), buf.slice(-2)]);
        // --- 组成 cgt 文件 ---
        await fs.promises.writeFile('dist/theme/' + item.name + '.cgt', buf);
    }
}
run().catch(function(e) {
    console.log(e);
});

import * as fs from 'fs';
import zip from 'jszip';
import * as terser from 'terser';

/**
 * --- 添加文件到 zip ---
 * @param zipo zip 对象，不以 / 结尾
 * @param base 绝对路径，不以 / 结尾
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
            //--- 文件 ---
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

// --- node ./dist/compcga ./dist/test/cga/app ./dist/test/cga/icon.png ---

(async function() {
    const args = process.argv.slice(2);
    if (!args[0]) {
        console.log('DIR MUST.');
        return;
    }
    const lasts = args[0].lastIndexOf('/');
    /** --- 基目录绝对，以 / 结尾 --- */
    const bpath = args[0].slice(0, lasts + 1);
    const name = args[0].slice(lasts + 1);
    /** --- zip 对象 --- */
    const zipo = new zip();
    await addFile(zipo, args[0], '');
    let buf = await zipo.generateAsync({
        'type': 'nodebuffer',
        'compression': 'DEFLATE',
        'compressionOptions': {
            'level': 9
        }
    });
    if (args[1]) {
        const icon = await fs.promises.readFile(args[1]);
        if (icon) {
            const length = icon.length.toString().padStart(7, '0');
            buf = Buffer.concat([Buffer.from(length), icon, buf]);
        }
        else {
            buf = Buffer.concat([Buffer.from('0000000'), buf]);
        }
    }
    else {
        buf = Buffer.concat([Buffer.from('0000000'), buf]);
    }
    await fs.promises.writeFile(bpath + name + '.cga', buf);
})() as any;

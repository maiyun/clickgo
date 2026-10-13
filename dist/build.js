import * as fs from 'fs';
/** --- /clickgo/ 可访问的发布资源，不包含源码、声明和内部维护文件 --- */
const files = [];
/**
 * --- 收集框架的公开运行资源 ---
 * @param path 当前磁盘目录，以 / 结尾
 * @returns 无返回值
 */
async function readDir(path) {
    const list = await fs.promises.readdir(path, {
        'withFileTypes': true,
    });
    for (const item of list) {
        if (item.name.startsWith('.')) {
            continue;
        }
        if (item.isFile()) {
            if (item.name.endsWith('.ts') || item.name.endsWith('.scss')) {
                continue;
            }
            if (item.name === 'AGENTS.md') {
                continue;
            }
            if ((path + item.name).startsWith('dist/build')) {
                continue;
            }
            if ((path + item.name).startsWith('dist/clickgo')) {
                continue;
            }
            if ((path + item.name).startsWith('dist/pack')) {
                continue;
            }
            files.push(path.slice(4) + item.name);
        }
        else {
            const nextPath = path + item.name + '/';
            if ([
                'dist/abox/',
                'dist/app/demo/',
                'dist/app/task/',
                'dist/compiler/',
                'dist/lib/',
                'dist/sources/',
                'dist/test/'
            ].includes(nextPath)) {
                continue;
            }
            files.push(nextPath.slice(4));
            await readDir(nextPath);
        }
    }
}
/**
 * --- 生成 fs 模块的公开资源清单 ---
 * @returns 无返回值
 */
async function run() {
    await readDir('dist/');
    const lists = JSON.stringify(files).replace(/"/g, '\'').replace(/,/g, ', ');
    const fcontent = await fs.promises.readFile('dist/lib/fs.ts', 'utf8');
    await fs.promises.writeFile('dist/lib/fs.ts', fcontent.replace(/clickgoFiles = \[([\s\S]+?)\]/, 'clickgoFiles = [' + lists.slice(1, -1) + ']'));
}
run().catch(function (e) {
    console.log(e);
});

import * as fs from 'fs';
const files = [];
async function readDir(path) {
    const list = await fs.promises.readdir(path, {
        'withFileTypes': true,
    });
    for (const item of list) {
        if (item.name === '.' || item.name === '..') {
            continue;
        }
        if (item.isFile()) {
            if (item.name.endsWith('.ts') && !item.name.endsWith('.d.ts')) {
                continue;
            }
            if (['.DS_Store', 'global.scss'].includes(item.name)) {
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
async function run() {
    await readDir('dist/');
    const lists = JSON.stringify(files).replace(/"/g, '\'').replace(/,/g, ', ');
    const fcontent = await fs.promises.readFile('dist/lib/fs.ts', 'utf8');
    await fs.promises.writeFile('dist/lib/fs.ts', fcontent.replace(/clickgoFiles = \[([\s\S]+?)\]/, 'clickgoFiles = [' + lists.slice(1, -1) + ']'));
}
run().catch(function (e) {
    console.log(e);
});

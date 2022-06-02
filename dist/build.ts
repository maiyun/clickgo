import * as fs from 'fs';

const files: string[] = [];
async function readDir(path: string): Promise<void> {
    const list = await fs.promises.readdir(path, {
        'withFileTypes': true
    });
    for (const item of list) {
        if (item.name === '.' || item.name === '..') {
            continue;
        }
        if (item.isFile()) {
            if (item.name.endsWith('.ts')) {
                if (path.startsWith('dist/app/')) {
                    continue;
                }
            }
            if (item.name.endsWith('.scss')) {
                continue;
            }
            if (item.name === '.DS_Store') {
                continue;
            }
            if ((path + item.name).startsWith('dist/build.')) {
                continue;
            }
            if ((path + item.name).startsWith('dist/compiler.')) {
                continue;
            }
            files.push(path.slice(4) + item.name);
        }
        else {
            if (path + item.name === 'dist/sources') {
                continue;
            }
            if (path + item.name === 'dist/test') {
                continue;
            }
            files.push(path.slice(4) + item.name + '/');
            await readDir(path + item.name + '/');
        }
    }
}

async function run(): Promise<void> {
    await readDir('dist/');
    const lists = JSON.stringify(files).replace(/"/g, '\'').replace(/,/g, ', ');
    const fcontent = await fs.promises.readFile('dist/lib/fs.ts', 'utf8');
    await fs.promises.writeFile('dist/lib/fs.ts', fcontent.replace(/clickgoFiles = \[([\s\S]+?)\]/, 'clickgoFiles = [' + lists.slice(1, -1) + ']'));
}
run().catch(function(e) {
    console.log(e);
});

import * as clickgo from 'clickgo';
import testFrm from './text';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ppath = '/';
        this.list = [];
        this.val = [];
        this.get = false;
    }
    async open(path) {
        if (!path.endsWith('/')) {
            path += '/';
        }
        this.list = [];
        const ls = await clickgo.fs.readDir(this, path);
        for (const item of ls) {
            this.list.push({
                'label': (item.isDirectory() ? '[FOLD]' : (item.isSymbolicLink() ? '[SYMB]' : '[FILE]')) + ' ' + item.name,
                'value': path + item.name
            });
        }
        this.ppath = path;
    }
    async stats() {
        const stats = await clickgo.fs.stats(this, this.val[0]);
        await clickgo.form.dialog(this, stats ? JSON.stringify(stats) : 'null');
    }
    dblclick(e) {
        clickgo.dom.bindDblClick(e, async () => {
            const r = await clickgo.fs.isFile(this, this.val[0]);
            if (r) {
                const extlio = this.val[0].lastIndexOf('.');
                if (extlio === -1) {
                    await clickgo.form.dialog(this, 'This extension is not supported.');
                    return;
                }
                const ext = this.val[0].toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php', 'txt'].includes(ext)) {
                    let content = await clickgo.fs.getContent(this, this.val[0], this.get ? {
                        'start': 2,
                        'end': 4
                    } : undefined);
                    if (!content) {
                        await clickgo.form.dialog(this, 'This file cannot be opened.');
                        return;
                    }
                    if (content instanceof Blob) {
                        content = await clickgo.tool.blob2Text(content);
                    }
                    const f = await clickgo.form.create(this, testFrm, {
                        'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                        'content': content
                    });
                    await f.show();
                    return;
                }
                await clickgo.form.dialog(this, 'The extension "' + ext + '" is not supported.');
                return;
            }
            await this.open(this.val[0]);
        });
    }
    async up() {
        if (this.ppath === '/') {
            return;
        }
        const path = this.ppath.slice(0, -1);
        const lif = path.lastIndexOf('/');
        const npath = path.slice(0, lif + 1);
        await this.open(npath);
    }
    async mount() {
        await clickgo.form.dialog(this, clickgo.fs.mount(this, 'test', {
            readDir: (path) => {
                const list = [];
                switch (path) {
                    case '/': {
                        list.push({
                            isFile: function () {
                                return false;
                            },
                            isDirectory: function () {
                                return true;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': 'test1'
                        });
                        list.push({
                            isFile: function () {
                                return false;
                            },
                            isDirectory: function () {
                                return true;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': 'test2'
                        });
                        break;
                    }
                    case '/test2/': {
                        list.push({
                            isFile: function () {
                                return true;
                            },
                            isDirectory: function () {
                                return false;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': 'test.txt'
                        });
                        break;
                    }
                }
                return list;
            },
            stats: (path) => {
                if (path !== '/test2/test.txt') {
                    return null;
                }
                const date = new Date();
                const ms = date.getTime();
                const size = 7;
                return {
                    isFile: function () {
                        return true;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'size': size,
                    'blksize': size,
                    'atimeMs': ms,
                    'mtimeMs': ms,
                    'ctimeMs': ms,
                    'birthtimeMs': ms,
                    'atime': date,
                    'mtime': date,
                    'ctime': date,
                    'birthtime': date
                };
            },
            getContent: (path, options) => {
                if (path !== '/test2/test.txt') {
                    return null;
                }
                const content = 'testabc';
                if (!options || typeof options === 'string') {
                    return content;
                }
                return content.slice(options.start, options.end);
            },
        }) ? 'true' : 'fasle');
    }
    async unmount() {
        await clickgo.form.dialog(this, await clickgo.fs.unmount('test') ? 'true' : 'false');
    }
    async onMounted() {
        await this.open('/');
    }
}

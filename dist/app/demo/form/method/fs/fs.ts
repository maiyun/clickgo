import * as types from '~/types';
import * as clickgo from 'clickgo';
import testFrm from './text';

export default class extends clickgo.form.AbstractForm {

    public ppath = '/';

    public list: any[] = [];

    public val: string[] = [];

    public get: boolean = false;

    public async open(path: string): Promise<void> {
        if (!path.endsWith('/')) {
            path += '/';
        }
        this.list = [];
        const ls = await clickgo.fs.readDir(path);
        for (const item of ls) {
            this.list.push({
                'label': (item.isDirectory() ? '[FOLD]' : (item.isSymbolicLink() ? '[SYMB]' : '[FILE]')) + ' ' + item.name,
                'value': path + item.name
            });
        }
        this.ppath = path;
    }

    public async stats(): Promise<void> {
        const stats = await clickgo.fs.stats(this.val[0]);
        await clickgo.form.dialog(stats ? JSON.stringify(stats) : 'null');
    }

    public dblclick(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindDblClick(e, async () => {
            const r = await clickgo.fs.isFile(this.val[0]);
            if (r) {
                const extlio: number = this.val[0].lastIndexOf('.');
                if (extlio === -1) {
                    await clickgo.form.dialog('This extension is not supported.');
                    return;
                }
                const ext: string = this.val[0].toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php', 'txt'].includes(ext)) {
                    let content = await clickgo.fs.getContent(this.val[0], this.get ? {
                        'start': 2,
                        'end': 4
                    } : undefined);
                    if (!content) {
                        await clickgo.form.dialog('This file cannot be opened.');
                        return;
                    }
                    if (content instanceof Blob) {
                        content = await clickgo.tool.blob2Text(content);
                    }
                    const f = await clickgo.form.create(testFrm, {
                        'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                        'content': content
                    });
                    f.show();
                    return;
                }
                await clickgo.form.dialog('The extension "' + ext + '" is not supported.');
                return;
            }
            await this.open(this.val[0]);
        });
    }

    public async up(): Promise<void> {
        if (this.ppath === '/') {
            return;
        }
        const path: string = this.ppath.slice(0, -1);
        const lif = path.lastIndexOf('/');
        const npath = path.slice(0, lif + 1);
        await this.open(npath);
    }

    public async mount(): Promise<void> {
        await clickgo.form.dialog(clickgo.fs.mount('test', {
            readDir: (path: string) => {
                const list: types.IDirent[] = [];
                switch (path) {
                    case '/': {
                        list.push({
                            isFile: function() {
                                return false;
                            },
                            isDirectory: function() {
                                return true;
                            },
                            isSymbolicLink: function() {
                                return false;
                            },
                            'name': 'test1'
                        });
                        list.push({
                            isFile: function() {
                                return false;
                            },
                            isDirectory: function() {
                                return true;
                            },
                            isSymbolicLink: function() {
                                return false;
                            },
                            'name': 'test2'
                        });
                        break;
                    }
                    case '/test2/': {
                        list.push({
                            isFile: function() {
                                return true;
                            },
                            isDirectory: function() {
                                return false;
                            },
                            isSymbolicLink: function() {
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
                    isFile: function() {
                        return true;
                    },
                    isDirectory: function() {
                        return false;
                    },
                    isSymbolicLink: function() {
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

    public async unmount(): Promise<void> {
        await clickgo.form.dialog(await clickgo.fs.unmount('test') ? 'true' : 'false');
    }

    public async onMounted(): Promise<void> {
        await this.open('/');
    }

}

import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'path': '/',
    'list': [],
    'val': ''
};

export const methods = {
    open: async function(this: types.IVForm, path: string): Promise<void> {
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
        this.path = path;
    },
    dblclick: async function(this: types.IVForm): Promise<void> {
        const r = await clickgo.fs.isFile(this.val);
        if (r) {
            const extlio: number = this.val.lastIndexOf('.');
            if (extlio === -1) {
                await clickgo.form.dialog('This extension is not supported.');
                return;
            }
            const ext: string = this.val.toLowerCase().slice(extlio + 1);
            if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php'].includes(ext)) {
                let content = await clickgo.fs.getContent(this.val);
                if (!content) {
                    await clickgo.form.dialog('This file cannot be opened.');
                    return;
                }
                if (content instanceof Blob) {
                    content = await clickgo.tool.blob2Text(content);
                }
                const f = await clickgo.form.create('text');
                if (typeof f === 'number') {
                    return;
                }
                clickgo.form.send(f.id, {
                    'title': this.val.slice((this.val as string).lastIndexOf('/') + 1),
                    'content': content
                });
                return;
            }
            await clickgo.form.dialog('This extension is not supported.');
            return;
        }
        await this.open(this.val);
    },
    up: async function(this: types.IVForm): Promise<void> {
        if (this.path === '/') {
            return;
        }
        const path: string = this.path.slice(0, -1);
        const lif = path.lastIndexOf('/');
        const npath = path.slice(0, lif + 1);
        await this.open(npath);
    }
};

export const mounted = async function(this: types.IVForm): Promise<void> {
    await this.open('/');
};

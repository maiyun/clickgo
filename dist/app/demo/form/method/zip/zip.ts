import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'path': '/',
    'list': [],
    'val': ''
};

export const methods = {
    select: function(this: types.IVForm): void {
        this.$refs.file.select();
    },
    change: async function(this: types.IVForm, files: FileList | null): Promise<void> {
        if (!files) {
            return;
        }
        const zip = await clickgo.zip.get(files[0]);
        if (!zip) {
            await clickgo.form.dialog('File failed to open.');
            return;
        }
        this.zip = zip;
        this.open('/');
    },
    open: function(this: types.IVForm, path: string): void {
        const zip = this.zip as types.TZip;
        if (!path.endsWith('/')) {
            path += '/';
        }
        this.list = [];
        const ls = zip.readDir(path);
        for (const item of ls) {
            this.list.push({
                'label': (item.isDirectory ? '[FOLD]' : '[FILE]') + ' ' + item.name,
                'value': path + item.name
            });
        }
        this.path = path;
    },
    dblclick: async function(this: types.IVForm): Promise<void> {
        if (!this.zip) {
            return;
        }
        const zip = this.zip as types.TZip;
        const r = zip.isFile(this.val);
        if (r) {
            const extlio: number = this.val.lastIndexOf('.');
            if (extlio === -1) {
                await clickgo.form.dialog('This extension is not supported.');
                return;
            }
            const ext: string = this.val.toLowerCase().slice(extlio + 1);
            if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php'].includes(ext)) {
                const content = await zip.getContent(this.val);
                if (!content) {
                    await clickgo.form.dialog('This file cannot be opened.');
                    return;
                }
                const f = await clickgo.form.create('../fs/text');
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
        this.open(this.val);
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
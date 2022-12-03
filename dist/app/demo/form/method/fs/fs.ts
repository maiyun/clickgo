import * as clickgo from 'clickgo';
import testFrm from './text';

export default class extends clickgo.form.AbstractForm {

    public ppath = '/';

    public list: any[] = [];

    public val: string[] = [];

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

    public async dblclick(): Promise<void> {
        const r = await clickgo.fs.isFile(this.val[0]);
        if (r) {
            const extlio: number = this.val[0].lastIndexOf('.');
            if (extlio === -1) {
                await clickgo.form.dialog('This extension is not supported.');
                return;
            }
            const ext: string = this.val[0].toLowerCase().slice(extlio + 1);
            if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php'].includes(ext)) {
                let content = await clickgo.fs.getContent(this.val[0]);
                if (!content) {
                    await clickgo.form.dialog('This file cannot be opened.');
                    return;
                }
                if (content instanceof Blob) {
                    content = await clickgo.tool.blob2Text(content);
                }
                const f = await testFrm.create({
                    'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                    'content': content
                });
                if (typeof f === 'number') {
                    return;
                }
                f.show();
                return;
            }
            await clickgo.form.dialog('The extension "' + ext + '" is not supported.');
            return;
        }
        await this.open(this.val[0]);
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

    public async onMounted(): Promise<void> {
        await this.open('/');
    }

}

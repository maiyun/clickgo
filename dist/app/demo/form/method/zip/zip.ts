import * as clickgo from 'clickgo';
import testFrm from '../fs/text';

export default class extends clickgo.form.AbstractForm {

    public ppath = '/';

    public list: any[] = [];

    public val: string[] = [];

    public access: {
        'zip'?: clickgo.zip.Zip;
    } = {
            'zip': undefined
        };

    public select(): void {
        this.refs.file.select();
    }

    public async change(files: FileList | null): Promise<void> {
        if (!files) {
            return;
        }
        const zip = await clickgo.zip.get(files[0]);
        if (!zip) {
            await clickgo.form.dialog('File failed to open.');
            return;
        }
        this.access.zip = zip;
        this.open('/');
    }

    public open(path: string): void {
        if (!this.access.zip) {
            return;
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        this.list = [];
        const ls = this.access.zip.readDir(path);
        for (const item of ls) {
            this.list.push({
                'label': (item.isDirectory ? '[FOLD]' : '[FILE]') + ' ' + item.name + ' (' + clickgo.tool.sizeFormat(item.uncompressedSize) + ')',
                'value': path + item.name
            });
        }
        this.ppath = path;
    }

    public dblclick(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindDblClick(e, async () => {
            if (!this.access.zip) {
                return;
            }
            const r = this.access.zip.isFile(this.val[0]);
            if (r) {
                const extlio: number = this.val[0].lastIndexOf('.');
                if (extlio === -1) {
                    await clickgo.form.dialog('This extension is not supported.');
                    return;
                }
                const ext: string = this.val[0].toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php', 'txt'].includes(ext)) {
                    const content = await this.access.zip.getContent(this.val[0]);
                    if (!content) {
                        await clickgo.form.dialog('This file cannot be opened.');
                        return;
                    }
                    const f = await clickgo.form.create(testFrm);
                    f.show();
                    this.send(f.formId, {
                        'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                        'content': content
                    });
                    return;
                }
                await clickgo.form.dialog('This extension is not supported.');
                return;
            }
            this.open(this.val[0]);
        });
    }

    public up(): void {
        if (this.ppath === '/') {
            return;
        }
        const path: string = this.ppath.slice(0, -1);
        const lif = path.lastIndexOf('/');
        const npath = path.slice(0, lif + 1);
        this.open(npath);
    }

}

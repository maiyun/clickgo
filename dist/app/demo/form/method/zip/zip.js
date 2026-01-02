import * as clickgo from 'clickgo';
import testFrm from '../fs/text';
export default class extends clickgo.form.AbstractForm {
    ppath = '/';
    list = [];
    val = [];
    access = {
        'zip': undefined
    };
    select() {
        this.refs.file.select();
    }
    async change(files) {
        if (!files) {
            return;
        }
        const zip = await clickgo.zip.get(files[0]);
        if (!zip) {
            await clickgo.form.dialog(this, 'File failed to open.');
            return;
        }
        this.access.zip = zip;
        this.open('/');
    }
    open(path) {
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
    dblclick(e) {
        clickgo.modules.pointer.dblClick(e, async () => {
            if (!this.access.zip) {
                return;
            }
            const r = this.access.zip.isFile(this.val[0]);
            if (r) {
                const extlio = this.val[0].lastIndexOf('.');
                if (extlio === -1) {
                    await clickgo.form.dialog(this, 'This extension is not supported.');
                    return;
                }
                const ext = this.val[0].toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php', 'txt'].includes(ext)) {
                    const content = await this.access.zip.getContent(this.val[0]);
                    if (!content) {
                        await clickgo.form.dialog(this, 'This file cannot be opened.');
                        return;
                    }
                    const f = await clickgo.form.create(this, testFrm);
                    await f.show();
                    this.send(f.formId, {
                        'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                        'content': content
                    });
                    return;
                }
                await clickgo.form.dialog(this, 'This extension is not supported.');
                return;
            }
            this.open(this.val[0]);
        });
    }
    up() {
        if (this.ppath === '/') {
            return;
        }
        const path = this.ppath.slice(0, -1);
        const lif = path.lastIndexOf('/');
        const npath = path.slice(0, lif + 1);
        this.open(npath);
    }
}

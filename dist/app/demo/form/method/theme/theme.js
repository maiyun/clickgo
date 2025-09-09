import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    async get(name) {
        const f = await clickgo.fs.getContent(this, '/clickgo/theme/' + name + '.cgt');
        if (!f) {
            return null;
        }
        if (typeof f === 'string') {
            return null;
        }
        const t = await clickgo.theme.read(f);
        if (!t) {
            return null;
        }
        return t;
    }
    async load() {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        const t = await this.get('blue');
        if (!t) {
            clickgo.form.hideNotify(n);
            return;
        }
        clickgo.form.hideNotify(n);
        const r = await clickgo.theme.load(this, t);
        await clickgo.form.dialog(this, 'Result: ' + (r ? 'true' : 'false'));
    }
    remove() {
        clickgo.theme.remove(this, 'blue').catch((e) => { throw e; });
    }
    clear() {
        clickgo.theme.clear(this).catch((e) => { throw e; });
    }
    async setGlobal(name) {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        const t = await this.get(name);
        if (!t) {
            clickgo.form.hideNotify(n);
            return;
        }
        clickgo.form.hideNotify(n);
        await clickgo.theme.setGlobal(t);
        await clickgo.form.dialog(this, 'Done.');
    }
    async clearGlobal() {
        await clickgo.theme.clearGlobal();
    }
    setMain(color) {
        clickgo.theme.setMain(color);
    }
}

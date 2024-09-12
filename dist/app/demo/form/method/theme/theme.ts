import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.form.AbstractForm {

    public async get(name: 'blue' | 'byterun' | 'light'): Promise<types.ITheme | null> {
        const f = await clickgo.fs.getContent('/clickgo/theme/' + name + '.cgt');
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

    public async load(): Promise<void> {
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
        const r = await clickgo.theme.load(t);
        await clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
    }

    public remove(): void {
        clickgo.theme.remove('blue').catch((e) => { throw e; });
    }

    public clear(): void {
        clickgo.theme.clear().catch((e) => { throw e; });
    }

    public async setGlobal(name: 'blue' | 'byterun' | 'light'): Promise<void> {
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
        await clickgo.form.dialog('Done.');
    }

    public clearGlobal(): void {
        clickgo.theme.clearGlobal();
    }

}

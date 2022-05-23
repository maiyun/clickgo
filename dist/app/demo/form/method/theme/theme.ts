import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const methods = {
    get: async function(this: types.IVForm): Promise<types.ITheme | null> {
        const f = await clickgo.fs.getContent('/clickgo/theme/familiar.cgt');
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
    },
    load: async function(this: types.IVForm): Promise<void> {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        const t = await this.get();
        if (!t) {
            clickgo.form.hideNotify(n);
            return;
        }
        clickgo.form.hideNotify(n);
        const r = await clickgo.theme.load(t);
        await clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
    },
    remove: function(): void {
        clickgo.theme.remove('familiar').catch((e) => { throw e; });
    },
    clear: function(): void {
        clickgo.theme.clear().catch((e) => { throw e; });
    },
    setGlobal: async function(this: types.IVForm): Promise<void> {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        const t = await this.get();
        if (!t) {
            clickgo.form.hideNotify(n);
            return;
        }
        clickgo.form.hideNotify(n);
        await clickgo.theme.setGlobal(t);
        await clickgo.form.dialog('Done.');
    },
    clearGlobal: function(): void {
        clickgo.theme.clearGlobal();
    }
};

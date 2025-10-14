import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public async get(name: 'dark' | 'light'): Promise<clickgo.theme.ITheme | null> {
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

    public async load(): Promise<void> {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        const t = await this.get('dark');
        if (!t) {
            clickgo.form.hideNotify(n);
            return;
        }
        clickgo.form.hideNotify(n);
        const r = await clickgo.theme.load(this, t);
        await clickgo.form.dialog(this, 'Result: ' + (r ? 'true' : 'false'));
    }

    public remove(): void {
        clickgo.theme.remove(this, 'dark').catch((e) => { throw e; });
    }

    public clear(): void {
        clickgo.theme.clear(this).catch((e) => { throw e; });
    }

    public async setGlobal(name: 'dark' | 'light'): Promise<void> {
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

    public async setGlobalFromFile(path: string): Promise<void> {
        const n = clickgo.form.notify({
            'title': 'Info',
            'content': 'Theme loading...',
            'type': 'info'
        });
        await clickgo.theme.setGlobal(path);
        clickgo.form.hideNotify(n);
        await clickgo.form.dialog(this, 'Done.');
    }

    public async clearGlobal(): Promise<void> {
        await clickgo.theme.clearGlobal();
    }

    public setMain(color?: string, hue?: number): void {
        clickgo.theme.setMain(color, hue);
    }

}

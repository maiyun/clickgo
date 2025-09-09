import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public key = 'test';

    public val = 'val';

    public list: string[] = [];

    public ppath: string = '';

    public async get(): Promise<void> {
        await clickgo.form.dialog(this, clickgo.storage.get(this, this.key) ?? 'null');
    }

    public async set(): Promise<void> {
        clickgo.storage.set(this, this.key, this.val);
        await clickgo.form.dialog(this, 'done');
    }

    public async remove(): Promise<void> {
        await clickgo.form.dialog(this, clickgo.storage.remove(this, this.key) ? 'true' : 'false');
    }

    public getlist(): void {
        this.list.length = 0;
        const obj = clickgo.storage.list(this);
        for (const key in obj) {
            this.list.push(key + ': ' + obj[key].toString() + ' Bytes');
        }
    }

    public all(): void {
        this.list.length = 0;
        this.ppath = '';
        const obj = clickgo.storage.all();
        for (const key in obj) {
            if (!this.ppath) {
                this.ppath = key;
            }
            this.list.push(key + ': ' + obj[key].toString() + ' Bytes');
        }
    }

    public async clear(): Promise<void> {
        await clickgo.form.dialog(this, 'Removed ' + (await clickgo.storage.clear(this.ppath)).toString() + ' items.');
    }

}

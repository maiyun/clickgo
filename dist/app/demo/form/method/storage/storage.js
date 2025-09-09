import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.key = 'test';
        this.val = 'val';
        this.list = [];
        this.ppath = '';
    }
    async get() {
        await clickgo.form.dialog(this, clickgo.storage.get(this, this.key) ?? 'null');
    }
    async set() {
        clickgo.storage.set(this, this.key, this.val);
        await clickgo.form.dialog(this, 'done');
    }
    async remove() {
        await clickgo.form.dialog(this, clickgo.storage.remove(this, this.key) ? 'true' : 'false');
    }
    getlist() {
        this.list.length = 0;
        const obj = clickgo.storage.list(this);
        for (const key in obj) {
            this.list.push(key + ': ' + obj[key].toString() + ' Bytes');
        }
    }
    all() {
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
    async clear() {
        await clickgo.form.dialog(this, 'Removed ' + (await clickgo.storage.clear(this.ppath)).toString() + ' items.');
    }
}

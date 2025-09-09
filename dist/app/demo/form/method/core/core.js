import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.hash = 'test';
        this.location = 'https://www.maiyun.net';
    }
    get config() {
        return JSON.stringify(clickgo.core.config, null, 4).replace(/"icon": "([\s\S]+?)"/g, '"icon": "data:image/..."');
    }
    async getAvailArea() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.core.getAvailArea()));
    }
    async hashe() {
        if (await clickgo.core.hash(this, this.hash)) {
            return;
        }
        await clickgo.form.dialog(this, 'No permission.');
    }
    async getHash() {
        await clickgo.form.dialog(this, 'Hash is: ' + clickgo.core.getHash());
    }
    async getHost() {
        await clickgo.form.dialog(this, 'Host is: ' + clickgo.core.getHost());
    }
    async locatione() {
        if (await clickgo.core.location(this, this.location)) {
            return;
        }
        await clickgo.form.dialog(this, 'No permission.');
    }
    async getLocation() {
        await clickgo.form.dialog(this, 'Location is: ' + clickgo.core.getLocation());
    }
    async back() {
        if (await clickgo.core.back(this)) {
            return;
        }
        await clickgo.form.dialog(this, 'No permission.');
    }
    open() {
        clickgo.core.open('https://www.maiyun.net');
    }
}

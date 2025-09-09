import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public hash: string = 'test';

    public location: string = 'https://www.maiyun.net';

    public get config(): string {
        return JSON.stringify(clickgo.core.config, null, 4).replace(/"icon": "([\s\S]+?)"/g, '"icon": "data:image/..."');
    }

    public async getAvailArea(): Promise<void> {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.core.getAvailArea()));
    }

    public async hashe(): Promise<void> {
        if (await clickgo.core.hash(this, this.hash)) {
            return;
        }
        await clickgo.form.dialog(this, 'No permission.');
    }

    public async getHash(): Promise<void> {
        await clickgo.form.dialog(this, 'Hash is: ' + clickgo.core.getHash());
    }

    public async getHost(): Promise<void> {
        await clickgo.form.dialog(this, 'Host is: ' + clickgo.core.getHost());
    }

    public async locatione(): Promise<void> {
        if (await clickgo.core.location(this, this.location)) {
            return;
        }
        await clickgo.form.dialog(this, 'No permission.');
    }

    public async getLocation(): Promise<void> {
        await clickgo.form.dialog(this, 'Location is: ' + clickgo.core.getLocation());
    }

    public async back(): Promise<void> {
        if (await clickgo.core.back(this)) {
            return;
        }
        await clickgo.form.dialog(this, 'No permission.');
    }

    public open(): void {
        clickgo.core.open('https://www.maiyun.net');
    }

}

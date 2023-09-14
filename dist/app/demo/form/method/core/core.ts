import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public hash: string = 'test';

    public location: string = 'https://www.maiyun.net';

    public get config(): string {
        return JSON.stringify(clickgo.core.config, null, 4).replace(/"icon": "([\s\S]+?)"/g, '"icon": "data:image/..."');
    }

    public async getCdn(): Promise<void> {
        await clickgo.form.dialog(clickgo.core.getCdn());
    }

    public async getAvailArea(): Promise<void> {
        await clickgo.form.dialog(JSON.stringify(clickgo.core.getAvailArea()));
    }

    public async hashe(): Promise<void> {
        if (clickgo.core.hash(this.hash)) {
            return;
        }
        await clickgo.form.dialog('No permission.');
    }

    public async getHash(): Promise<void> {
        await clickgo.form.dialog('Hash is: ' + clickgo.core.getHash());
    }

    public async locatione(): Promise<void> {
        if (clickgo.core.location(this.location)) {
            return;
        }
        await clickgo.form.dialog('No permission.');
    }

    public async getLocation(): Promise<void> {
        await clickgo.form.dialog('Location is: ' + clickgo.core.getLocation());
    }

    public async back(): Promise<void> {
        if (clickgo.core.back()) {
            return;
        }
        await clickgo.form.dialog('No permission.');
    }

}

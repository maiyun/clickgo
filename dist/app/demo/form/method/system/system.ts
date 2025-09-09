import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public async getVersion(): Promise<void> {
        await clickgo.form.dialog(this, 'Version: ' + clickgo.getVersion());
    }

    public async isNative(): Promise<void> {
        await clickgo.form.dialog(this, 'Native: ' + (clickgo.isNative() ? 'true' : 'false'));
    }

    public get global(): string {
        return JSON.stringify(clickgo.global, null, 4);
    }

    public async getCdn(): Promise<void> {
        await clickgo.form.dialog(this, 'Cdn: ' + clickgo.getCdn());
    }

    public async getPlatform(): Promise<void> {
        await clickgo.form.dialog(this, 'Platform: ' + clickgo.getPlatform());
    }

    public async getDevice(): Promise<void> {
        await clickgo.form.dialog(this, 'Device: ' + JSON.stringify(clickgo.getDevice()));
    }

    public async hasFrame(): Promise<void> {
        await clickgo.form.dialog(this, 'hasFrame: ' + (clickgo.hasFrame() ? 'true' : 'false'));
    }

    public async ls(): Promise<void> {
        await clickgo.form.dialog(this, 'typeof localStorage: ' + typeof localStorage);
    }

    public async map(): Promise<void> {
        await clickgo.form.dialog(this, 'typeof Map: ' + typeof Map);
    }

}

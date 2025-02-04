import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public async getVersion(): Promise<void> {
        await clickgo.form.dialog('Version: ' + clickgo.getVersion());
    }

    public async isNative(): Promise<void> {
        await clickgo.form.dialog('Native: ' + (clickgo.isNative() ? 'true' : 'false'));
    }

    public async getPlatform(): Promise<void> {
        await clickgo.form.dialog('Platform: ' + clickgo.getPlatform());
    }

    public async isImmersion(): Promise<void> {
        await clickgo.form.dialog('Immersion: ' + (clickgo.isImmersion() ? 'true' : 'false'));
    }

    public async hasFrame(): Promise<void> {
        await clickgo.form.dialog('hasFrame: ' + (clickgo.hasFrame() ? 'true' : 'false'));
    }

    public async ls(): Promise<void> {
        await clickgo.form.dialog('typeof localStorage: ' + typeof localStorage);
    }

    public async map(): Promise<void> {
        await clickgo.form.dialog('typeof Map: ' + typeof Map);
    }

}

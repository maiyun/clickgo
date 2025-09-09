import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    async getVersion() {
        await clickgo.form.dialog(this, 'Version: ' + clickgo.getVersion());
    }
    async isNative() {
        await clickgo.form.dialog(this, 'Native: ' + (clickgo.isNative() ? 'true' : 'false'));
    }
    get global() {
        return JSON.stringify(clickgo.global, null, 4);
    }
    async getCdn() {
        await clickgo.form.dialog(this, 'Cdn: ' + clickgo.getCdn());
    }
    async getPlatform() {
        await clickgo.form.dialog(this, 'Platform: ' + clickgo.getPlatform());
    }
    async getDevice() {
        await clickgo.form.dialog(this, 'Device: ' + JSON.stringify(clickgo.getDevice()));
    }
    async hasFrame() {
        await clickgo.form.dialog(this, 'hasFrame: ' + (clickgo.hasFrame() ? 'true' : 'false'));
    }
    async ls() {
        await clickgo.form.dialog(this, 'typeof localStorage: ' + typeof localStorage);
    }
    async map() {
        await clickgo.form.dialog(this, 'typeof Map: ' + typeof Map);
    }
}

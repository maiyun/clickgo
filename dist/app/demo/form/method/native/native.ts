import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public val = 'test';

    public activating = false;

    public async getListenerList(): Promise<void> {
        await clickgo.form.dialog(JSON.stringify(clickgo.native.getListenerList()));
    }

    public async max(): Promise<void> {
        await clickgo.native.max();
    }

    public async min(): Promise<void> {
        await clickgo.native.min();
    }

    public async activate(): Promise<void> {
        if (this.activating) {
            return;
        }
        this.activating = true;
        await clickgo.tool.sleep(2_000);
        await clickgo.native.activate();
        this.activating = false;
    }

    public async ping(): Promise<void> {
        await clickgo.form.dialog(await clickgo.native.ping(this.val) ?? 'undefined');
    }

    public async isMax(): Promise<void> {
        await clickgo.form.dialog(await clickgo.native.isMax() ? 'true' : 'false');
    }

}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    val = 'test';
    activating = false;
    async getListenerList() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.native.getListenerList()));
    }
    async max() {
        await clickgo.native.max(this);
    }
    async min() {
        await clickgo.native.min(this);
    }
    async activate() {
        if (this.activating) {
            return;
        }
        this.activating = true;
        await clickgo.tool.sleep(2_000);
        await clickgo.native.activate(this);
        this.activating = false;
    }
    async ping() {
        await clickgo.form.dialog(this, await clickgo.native.ping(this.val) ?? 'undefined');
    }
    async isMax() {
        await clickgo.form.dialog(this, await clickgo.native.isMax() ? 'true' : 'false');
    }
    async open() {
        const rtn = await clickgo.native.open({
            'filters': [
                {
                    'name': 'Image',
                    'accept': ['jpg', 'png'],
                },
            ],
        });
        await clickgo.form.dialog(this, JSON.stringify(rtn));
    }
    async save() {
        const rtn = await clickgo.native.save({
            'filters': [
                {
                    'name': 'Image',
                    'accept': ['jpg', 'png'],
                },
            ],
        });
        await clickgo.form.dialog(this, JSON.stringify(rtn));
    }
    async dialog(opts) {
        const rtn = await clickgo.native.dialog({
            'title': opts.title,
            'message': opts.message,
            'type': opts.type,
            'detail': opts.detail,
            'buttons': opts.buttons,
        });
        await clickgo.form.dialog(this, JSON.stringify(rtn));
    }
}

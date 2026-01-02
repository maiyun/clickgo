import * as clickgo from 'clickgo';
import sdFrm from './sd';
export default class extends clickgo.form.AbstractForm {
    fid = '0';
    sendValue = 'sendValue';
    test = 'A';
    dr = '';
    hash = 'testhash';
    ssend() {
        this.send(this.fid, {
            'key': this.sendValue
        });
    }
    async hhide() {
        this.hide();
        await clickgo.tool.sleep(1000);
        await this.show();
    }
    async sshowDialog() {
        const frm = await clickgo.form.create(this, sdFrm);
        this.dr = await frm.showDialog();
    }
    async showLoading() {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }
    async showLoadingFast() {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
        // --- do something ---
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }
    async toEnterStep() {
        const rtn = await this.enterStep([
            {
                'value': 'step1',
                'label': 'step1'
            },
            {
                'value': 'step2'
            },
            {
                'icon': '/package/res/marker.svg',
                'value': 'icon'
            },
            {
                'label': 'successful',
                'value': 'step3',
                'desc': 'qq'
            }
        ]);
        await clickgo.form.dialog(this, 'Result: ' + (rtn ? 'true' : 'false'));
    }
    onMounted() {
        this.watch('test', async () => {
            await clickgo.form.dialog(this, 'test changed.');
        });
    }
}

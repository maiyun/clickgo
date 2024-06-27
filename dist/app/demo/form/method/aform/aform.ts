import * as clickgo from 'clickgo';
import sdFrm from './sd';

export default class extends clickgo.form.AbstractForm {

    public fid = '0';

    public sendValue = 'sendValue';

    public test = 'A';

    public dr = '';

    public hash = 'testhash';

    public ssend(): void {
        this.send(parseInt(this.fid), {
            'key': this.sendValue
        });
    }

    public async hhide(): Promise<void> {
        this.hide();
        await clickgo.tool.sleep(1000);
        this.show();
    }

    public async sshowDialog(): Promise<void> {
        const frm = await clickgo.form.create(sdFrm);
        this.dr = await frm.showDialog();
    }

    public async showLoading(): Promise<void> {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }

    public async showLoadingFast() {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
        // --- do something ---
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }

    public async toEnterStep(): Promise<void> {
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
        await clickgo.form.dialog('Result: ' + (rtn ? 'true' : 'false'));
    }

    public onMounted(): void {
        this.watch('test', async () => {
            await clickgo.form.dialog('test changed.');
        });
    }

}

import * as clickgo from 'clickgo';
import sdFrm from './sd';

export default class extends clickgo.form.AbstractForm {

    public fid = '0';

    public sendValue = 'sendValue';

    public test = 'A';

    public dr = '';

    public async ccreateForm(): Promise<void> {
        const frm = await this.createForm('test');
        if (typeof frm === 'number') {
            return;
        }
        frm.show();
    }

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
        const frm = await sdFrm.create();
        if (typeof frm === 'number') {
            return;
        }
        this.dr = await frm.showDialog();
    }

    public onMounted(): void {
        this.watch('test', async () => {
            await clickgo.form.dialog('test changed.');
        });
    }

}

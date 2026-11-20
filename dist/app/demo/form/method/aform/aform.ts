import * as clickgo from 'clickgo';
import sdFrm from './sd';

export default class extends clickgo.form.AbstractForm {

    public fid = '0';

    public sendValue = 'sendValue';

    public test = 'A';

    public dr = '';

    public access = {
        'dialog': null as sdFrm | null,
        'disposed': false,
    };

    public hash = 'testhash';

    public ssend(): void {
        this.send(this.fid, {
            'key': this.sendValue
        });
    }

    public async hhide(): Promise<void> {
        this.hide();
        await clickgo.tool.sleep(1000);
        await this.show();
    }

    /** --- 隐藏后复用同一个窗体，关闭后重新创建 --- */
    public async openDialog(): Promise<void> {
        if (this.loading || this.access.disposed) {
            return;
        }
        let dialog = this.access.dialog;
        if (!dialog) {
            this.loading = true;
            try {
                dialog = await clickgo.form.create(this, sdFrm);
                if (this.access.disposed) {
                    dialog.close();
                    return;
                }
                this.access.dialog = dialog;
            }
            finally {
                this.loading = false;
            }
        }
        this.dr = await dialog.showDialog();
        if (!clickgo.form.get(dialog.formId)) {
            this.access.dialog = null;
        }
    }

    /** --- 父窗体卸载时释放仍保留的演示窗体 --- */
    public onBeforeUnmount(): void {
        this.access.disposed = true;
        this.access.dialog?.close();
        this.access.dialog = null;
    }

    public async showLoading(): Promise<void> {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }

    public async showLoadingFast(): Promise<void> {
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
        await clickgo.form.dialog(this, 'Result: ' + (rtn ? 'true' : 'false'));
    }

    public onMounted(): void {
        this.watch('test', async () => {
            await clickgo.form.dialog(this, 'test changed.');
        });
    }

}

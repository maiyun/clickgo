import * as clickgo from 'clickgo';
import sdFrm from './sd';
export default class extends clickgo.form.AbstractForm {
    fid = '0';
    sendValue = 'sendValue';
    test = 'A';
    dr = '';
    access = {
        'dialog': null,
        'disposed': false,
    };
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
    /** --- 隐藏后复用同一个窗体，关闭后重新创建 --- */
    async openDialog() {
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
    onBeforeUnmount() {
        this.access.disposed = true;
        this.access.dialog?.close();
        this.access.dialog = null;
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

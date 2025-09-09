import * as clickgo from 'clickgo';
import test1Panel from '../../control/panel/test1';

export default class extends clickgo.form.AbstractForm {

    public fh: string = '';

    public name: string = '';

    public mountData = 'none';

    public map: Record<string, any> = {
        'test1': test1Panel,
        'test2': '../../control/panel/test2'
    };

    public onFormHashChange(taskId: string, formId: string, value: string): void {
        if (formId !== this.formId) {
            return;
        }
        this.fh = value;
    }

    public async onSelect(e: clickgo.control.INavItemSelectEvent): Promise<void> {
        e.preventDefault();
        await clickgo.form.dialog(this, 'Show form');
    }

    public onJumpdataSelect(e: clickgo.control.INavItemSelectEvent): void {
        e.preventDefault();
        this.formHashData = { 'key': 'form hash data' };
        this.formHash = 'test1';
    }

    public async onMounted(data: Record<string, any>): Promise<void> {
        if (!data.hash) {
            return;
        }
        this.formHash = data.hash;
        await clickgo.tool.sleep(500);
        this.mountData = 'ok';
    }

}

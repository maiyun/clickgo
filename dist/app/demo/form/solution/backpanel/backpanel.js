import * as clickgo from 'clickgo';
import test1Panel from '../../control/panel/test1';
export default class extends clickgo.form.AbstractForm {
    fh = '';
    name = '';
    mountData = 'none';
    map = {
        'test1': test1Panel,
        'test2': '../../control/panel/test2'
    };
    onFormHashChange(taskId, formId, value) {
        if (formId !== this.formId) {
            return;
        }
        this.fh = value;
    }
    async onSelect(e) {
        e.preventDefault();
        await clickgo.form.dialog(this, 'Show form');
    }
    onJumpdataSelect(e) {
        e.preventDefault();
        this.formHashData = { 'key': 'form hash data' };
        this.formHash = 'test1';
    }
    async onMounted(data) {
        if (!data.hash) {
            return;
        }
        this.formHash = data.hash;
        await clickgo.tool.sleep(500);
        this.mountData = 'ok';
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    draft = '';
    nestedResult = '';
    /** --- 打开第二层模态，返回后可以继续操作当前窗体 --- */
    async newDialog() {
        this.nestedResult = await clickgo.form.dialog(this, {
            'content': 'Return to the first dialog.',
            'buttons': ['Back'],
        });
    }
}

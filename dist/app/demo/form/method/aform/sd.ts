import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public draft = '';

    public nestedResult = '';

    /** --- 打开第二层模态，返回后可以继续操作当前窗体 --- */
    public async newDialog(): Promise<void> {
        this.nestedResult = await clickgo.form.dialog(this, {
            'content': 'Return to the first dialog.',
            'buttons': ['Back'],
        });
    }

}

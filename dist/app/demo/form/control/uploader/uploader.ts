import * as clickgo from 'clickgo';
import imgFrm from '../arteditor/img';

export default class extends clickgo.form.AbstractForm {

    public list: string[] = [];

    public disabled = false;

    public multi: boolean = false;

    /** --- 上传进度 --- */
    public progress?: number = undefined;

    public async select(): Promise<void> {
        const frm = await clickgo.form.create(imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        this.progress = 0;
        const timer = clickgo.task.createTimer(async () => {
            if (this.progress === undefined) {
                clickgo.task.removeTimer(timer);
                return;
            }
            this.progress += clickgo.tool.rand(0, 20);
            if (this.progress < 100) {
                return;
            }
            this.progress = 100;
            clickgo.task.removeTimer(timer);
            await clickgo.tool.sleep(500);
            this.progress = undefined;
            this.list.push(path);
        }, 500);
    }

}

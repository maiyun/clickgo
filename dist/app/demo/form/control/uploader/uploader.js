import * as clickgo from 'clickgo';
import imgFrm from '../arteditor/img';
export default class extends clickgo.form.AbstractForm {
    list = [
        {
            'title': 'main',
            'src': 'res/img.jpg'
        }
    ];
    disabled = false;
    multi = false;
    drag = false;
    length = ['7'];
    /** --- 上传进度 --- */
    progress = undefined;
    async select() {
        const frm = await clickgo.form.create(this, imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        this.progress = 0;
        const timer = clickgo.task.createTimer(this, async () => {
            if (this.progress === undefined) {
                clickgo.task.removeTimer(this, timer);
                return;
            }
            this.progress += clickgo.tool.rand(0, 70);
            if (this.progress < 100) {
                return;
            }
            this.progress = 100;
            clickgo.task.removeTimer(this, timer);
            await clickgo.tool.sleep(500);
            this.progress = undefined;
            this.list.push(path);
        }, 500);
    }
}

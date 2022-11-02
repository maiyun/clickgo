import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public fid = '0';

    public sendValue = 'sendValue';

    public tid = '0';

    public type = 'primary';

    public progress = 'noraml';

    public dr: string | number | boolean = '';

    public setTopMostValue = false;

    public min(): void {
        clickgo.form.min(this.formId);
    }

    public max(): void {
        clickgo.form.max(this.formId);
    }

    public close(): void {
        clickgo.form.close(this.formId);
    }

    public bindResize(e: MouseEvent | TouchEvent): void {
        clickgo.form.bindResize(e, 'rb');
    }

    public bindDrag(e: MouseEvent | TouchEvent): void {
        clickgo.form.bindDrag(e);
    }

    public getTaskId(): void {
        clickgo.form.dialog(clickgo.form.getTaskId(parseInt(this.fid)).toString()).catch((e) => { throw e; });
    }

    public get(): void {
        clickgo.form.dialog(JSON.stringify(clickgo.form.get(parseInt(this.fid)))).catch((e) => { throw e; });
    }

    public send(): void {
        clickgo.form.send(parseInt(this.fid), {
            'key': this.sendValue
        });
    }

    public changeFocus(): void {
        clickgo.form.changeFocus(parseInt(this.fid));
    }

    public getList(): void {
        let str = JSON.stringify(clickgo.form.getList(this.taskId));
        str = str.replace(/"icon":"(.*?)"/g, function(t: string, t1: string): string {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        clickgo.form.dialog(`<overflow direction="v" style="width: 200px; height: 80px;">${str}</overflow>`).catch((e) => { throw e; });
    }

    public getMaxZIndexID(): void {
        const fid = clickgo.form.getMaxZIndexID();
        clickgo.form.dialog(JSON.stringify(fid)).catch((e) => { throw e; });
    }

    public getRectByBorder(): void {
        const size = clickgo.form.getRectByBorder('rb');
        clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
    }

    public showCircular(e: MouseEvent): void {
        clickgo.form.showCircular(e.clientX, e.clientY);
    }

    public async showRectangle(e: MouseEvent): Promise<void> {
        clickgo.form.showRectangle(e.clientX, e.clientY, 'rb');
        await clickgo.tool.sleep(1000);
        clickgo.form.hideRectangle();
    }

    public async showDrag(): Promise<void> {
        clickgo.form.showDrag();
        const rect = this.refs.showDrag.$el.getBoundingClientRect();
        clickgo.form.moveDrag({
            'left': rect.left,
            'top': rect.top,
            'width': rect.width,
            'height': rect.height
        });
        await clickgo.tool.sleep(1000);
        clickgo.form.hideDrag();
    }

    public async notify(): Promise<void> {
        let icon: string | Blob | null = null;
        if (this.progress === 'progress + icon') {
            icon = await clickgo.fs.getContent('/package/res/icon.svg');
        }
        if (icon instanceof Blob) {
            icon = await clickgo.tool.blob2DataUrl(icon);
        }
        const nid = clickgo.form.notify({
            'title': 'Notify',
            'content': 'Content',
            'type': this.type as any,
            'progress': (this.progress === 'progress + icon') ? true : false,
            'icon': icon
        });
        if (this.progress === 'progress + icon') {
            clickgo.form.notifyProgress(nid, 12);
            await clickgo.tool.sleep(1000);
            clickgo.form.notifyProgress(nid, 30);
            await clickgo.tool.sleep(300);
            clickgo.form.notifyProgress(nid, 50);
            await clickgo.tool.sleep(700);
            clickgo.form.notifyProgress(nid, 75);
            await clickgo.tool.sleep(1000);
            clickgo.form.notifyProgress(nid, 100);
        }
    }

    public showPop(e: MouseEvent): void {
        if (!e.currentTarget) {
            return;
        }
        clickgo.form.showPop(e.currentTarget as HTMLElement, this.refs.pop, 'v');
    }

    public createParam(): void {
        clickgo.form.create({
            'layout': '<form width=\'300\' height=\'300\' title=\'normal\'></form>'
        }).catch((e) => { throw e; });
    }

    public createPath(): void {
        this.createForm('test').then((e) => { console.log(e); }).catch((e) => { throw e; });
    }

    public async createTop(): Promise<void> {
        const frm = await this.createForm('test');
        if (typeof frm === 'number') {
            return;
        }
        frm.topMost = true;
    }

    public async dialog(): Promise<void> {
        this.dr = await clickgo.form.dialog('Hello world!');
    }

    public async dialogLong(): Promise<void> {
        this.dr = await clickgo.form.dialog('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
    }

    public async dialogTitle(): Promise<void> {
        this.dr = await clickgo.form.dialog({
            'title': 'Title',
            'content': 'Hello world!'
        });
    }

    public async dialogButtons(): Promise<void> {
        this.dr = await clickgo.form.dialog({
            'content': 'Hello world!',
            'buttons': ['A', 'B', 'C']
        });
    }

    public async dialogCannot(): Promise<void> {
        this.dr = await clickgo.form.dialog({
            'content': 'Hello world!',
            'buttons': ['Do not close', 'Close'],
            'select': (e: Event, button: string): void => {
                if (button === 'Do not close') {
                    e.preventDefault();
                }
            }
        });
    }

    public async confirm(cancel: boolean): Promise<void> {
        this.dr = await clickgo.form.confirm({
            'content': 'Hello world?',
            'cancel': cancel
        });
        if (typeof this.dr === 'boolean') {
            this.dr = this.dr ? 'true (boolean)' : 'false (boolean)';
        }
        else {
            this.dr = this.dr.toString() + ' (number)';
        }
    }

    public setTopMost(): void {
        this.setTopMostValue = !this.setTopMostValue;
        this.topMost = this.setTopMostValue;
    }

    public flash(): void {
        clickgo.form.flash(this.formId);
    }

    public async hhide(): Promise<void> {
        this.hide();
        await clickgo.tool.sleep(1000);
        this.show();
    }

    public onReceive(obj: Record<string, any>): void {
        clickgo.form.dialog(JSON.stringify(obj)).catch((e) => { throw e; });
    }

    public onMounted(): void {
        this.fid = this.formId.toString();
        this.tid = this.taskId.toString();
    }

}

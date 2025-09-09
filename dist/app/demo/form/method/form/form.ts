import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public fid = '0';

    public tid = '0';

    public type = ['primary'];

    public atype = ['default'];

    public progress = ['noraml'];

    public dr: string | number | boolean = '';

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
        clickgo.form.dialog(this, clickgo.form.getTaskId(this.fid).toString()).catch(() => {});
    }

    public get(): void {
        clickgo.form.dialog(this, JSON.stringify(clickgo.form.get(this.fid))).catch(() => {});
    }

    public async getHash(): Promise<void> {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.form.getHash(this.fid)));
    }

    public async hashBack(): Promise<void> {
        await clickgo.form.dialog(this, JSON.stringify(await clickgo.form.hashBack(this.fid)));
    }

    public async tohash(): Promise<void> {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.form.hash(this.fid, this.hash)));
    }

    public hash: string = 'hash' + clickgo.tool.rand(0, 100).toString();

    public async getActivePanel(): Promise<void> {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.form.getActivePanel(this.fid)));
    }

    public async getFocus(): Promise<void> {
        const f = clickgo.form.getFocus();
        await clickgo.form.dialog(this, f ? f.toString() : 'null');
    }

    public async changeFocus(): Promise<void> {
        await clickgo.form.changeFocus(this.fid);
    }

    public getList(): void {
        let str = JSON.stringify(clickgo.form.getList(this.tid));
        str = str.replace(/"icon":"(.*?)"/g, function(t: string, t1: string): string {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        clickgo.form.dialog(this, `<flow direction="v" style="width: 200px; height: 80px;">${str}</flow>`).catch(() => {});
    }

    public async getMaxZIndexID(): Promise<void> {
        const fid = await clickgo.form.getMaxZIndexID(this);
        clickgo.form.dialog(this, JSON.stringify(fid)).catch(() => {});
    }

    public getRectByBorder(): void {
        const size = clickgo.form.getRectByBorder('rb');
        clickgo.form.dialog(this, JSON.stringify(size)).catch(() => {});
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
        clickgo.form.showDrag({
            'element': this.refs.showDrag.$el,
        });
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
        if (this.progress[0] === 'progress + icon') {
            icon = await clickgo.fs.getContent(this, '/package/res/icon.svg');
        }
        if (icon instanceof Blob) {
            icon = await clickgo.tool.blob2DataUrl(icon);
        }
        const nid = clickgo.form.notify({
            'title': this.progress[0] === 'only content' ? undefined : 'Notify',
            'content': this.progress[0] === 'only title' ? undefined : 'Content',
            'type': this.type[0] as any,
            'progress': (this.progress[0] === 'progress + icon') ? true : false,
            'icon': icon
        });
        if (this.progress[0] === 'progress + icon') {
            clickgo.form.notifyProgress(nid, 12);
            await clickgo.tool.sleep(1000);
            clickgo.form.notifyProgress(nid, 30);
            await clickgo.tool.sleep(300);
            clickgo.form.notifyProgress(nid, 50);
            clickgo.form.notifyContent(nid, {
                'content': 'loading... (3/4)'
            });
            await clickgo.tool.sleep(700);
            clickgo.form.notifyProgress(nid, 75);
            clickgo.form.notifyContent(nid, {
                'content': 'loading... (4/4)'
            });
            await clickgo.tool.sleep(1000);
            clickgo.form.notifyProgress(nid, 100);
            clickgo.form.notifyContent(nid, {
                'title': 'Done',
                'content': 'loaded'
            });
        }
    }

    public alert(): void {
        const aid = clickgo.form.alert(this.atype[0], this.atype[0] as any);
        console.log('aid', aid);
    }

    public showPop(e: MouseEvent): void {
        if (!e.currentTarget) {
            return;
        }
        clickgo.form.showPop(e.currentTarget as HTMLElement, this.refs.pop, 'v');
    }

    public async create(): Promise<void> {
        const frm = await clickgo.form.create(this, 'test', undefined, {
            'path': this.filename
        });
        await frm.show();
    }

    public async dialog(): Promise<void> {
        this.dr = await clickgo.form.dialog(this, 'Hello world!');
    }

    public async dialogLong(): Promise<void> {
        this.dr = await clickgo.form.dialog(this, 'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
    }

    public async dialogTitle(): Promise<void> {
        this.dr = await clickgo.form.dialog(this, {
            'title': 'Title',
            'content': 'Hello world!'
        });
    }

    public async dialogButtons(): Promise<void> {
        this.dr = await clickgo.form.dialog(this, {
            'content': 'Hello world!',
            'buttons': ['A', 'B', 'C']
        });
    }

    public async dialogCannot(): Promise<void> {
        this.dr = await clickgo.form.dialog(this, {
            'content': 'Hello world!',
            'buttons': ['Do not close', 'Close'],
            'select': (e: clickgo.form.IFormDialogSelectEvent, button: string): void => {
                if (button === 'Do not close') {
                    e.preventDefault();
                }
            }
        });
    }

    public async dialogData(): Promise<void> {
        this.dr = await clickgo.form.dialog(this, {
            'direction': 'v',
            'gutter': 10,
            'content': '<block>Hello text!</block><text :modelValue="data.txt" />',
            'data': {
                'txt': 'Text\nLine 2.'
            }
        });
    }

    public async confirm(cancel: boolean): Promise<void> {
        this.dr = await clickgo.form.confirm(this, {
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

    public async prompt(): Promise<void> {
        this.dr = await clickgo.form.prompt(this, 'test');
    }

    public async flash(): Promise<void> {
        await clickgo.form.flash(this, this.formId);
    }

    public showLauncher(): void {
        clickgo.form.showLauncher();
    }

    public onReceive(obj: Record<string, any>): void {
        clickgo.form.dialog(this, JSON.stringify(obj)).catch(() => {});
    }

    public onMounted(): void {
        this.fid = this.formId.toString();
        this.tid = this.taskId.toString();
    }

}

import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'fid': '0',
    'sendValue': 'sendValue',
    'tid': '0',
    'type': 'primary',
    'progress': 'noraml',
    'dialogResult': '',
    'setTopMostValue': false
};

export const methods = {
    min: function(this: types.IVForm): void {
        clickgo.form.min();
    },
    max: function(this: types.IVForm): void {
        clickgo.form.max();
    },
    close: function(this: types.IVForm): void {
        clickgo.form.close();
    },
    bindResize: function(this: types.IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.form.bindResize(e, 'rb');
    },
    bindDrag: function(this: types.IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.form.bindDrag(e);
    },
    getTaskId: function(this: types.IVForm): void {
        clickgo.form.dialog(clickgo.form.getTaskId(parseInt(this.fid)).toString()).catch((e) => { throw e; });
    },
    get: function(this: types.IVForm): void {
        clickgo.form.dialog(JSON.stringify(clickgo.form.get(parseInt(this.fid)))).catch((e) => { throw e; });
    },
    send: function(this: types.IVForm): void {
        clickgo.form.send(parseInt(this.fid), {
            'key': this.sendValue
        });
    },
    changeFocus: function(this: types.IVForm): void {
        clickgo.form.changeFocus(parseInt(this.fid));
    },
    getList: function(this: types.IVForm): void {
        let str = JSON.stringify(clickgo.form.getList(this.taskId));
        str = str.replace(/"icon":"(.*?)"/g, function(t: string, t1: string): string {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        clickgo.form.dialog(`<overflow direction="v" style="width: 200px; height: 80px;">${str}</overflow>`).catch((e) => { throw e; });
    },
    getMaxZIndexID: function(this: types.IVForm): void {
        const fid = clickgo.form.getMaxZIndexID();
        clickgo.form.dialog(JSON.stringify(fid)).catch((e) => { throw e; });
    },
    getRectByBorder: function(this: types.IVForm): void {
        const size = clickgo.form.getRectByBorder('rb');
        clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
    },
    showCircular: function(this: types.IVForm, e: MouseEvent): void {
        clickgo.form.showCircular(e.clientX, e.clientY);
    },
    showRectangle: async function(this: types.IVForm, e: MouseEvent): Promise<void> {
        clickgo.form.showRectangle(e.clientX, e.clientY, 'rb');
        await clickgo.tool.sleep(1000);
        clickgo.form.hideRectangle();
    },
    showDrag: async function(this: types.IVForm): Promise<void> {
        clickgo.form.showDrag();
        const rect = this.$refs.showDrag.$el.getBoundingClientRect();
        clickgo.form.moveDrag({
            'left': rect.left,
            'top': rect.top,
            'width': rect.width,
            'height': rect.height
        });
        await clickgo.tool.sleep(1000);
        clickgo.form.hideDrag();
    },
    notify: async function(this: types.IVForm): Promise<void> {
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
            'type': this.type,
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
    },
    showPop: function(this: types.IVForm, e: MouseEvent): void {
        if (!e.currentTarget) {
            return;
        }
        clickgo.form.showPop(e.currentTarget as HTMLElement, this.$refs.pop, 'v');
    },
    createParam: function(this: types.IVForm): void {
        clickgo.form.create({
            'layout': '<form width=\'300\' height=\'300\' title=\'normal\'></form>'
        }).catch((e) => { throw e; });
    },
    createPath: function(this: types.IVForm): void {
        clickgo.form.create('test').then((e) => { console.log(e); }).catch((e) => { throw e; });
    },
    createTop: function(this: types.IVForm): void {
        clickgo.form.create({
            'layout': '<form width=\'300\' height=\'300\' title=\'normal\'></form>',
            'topMost': true
        }).catch((e) => { throw e; });
    },
    dialog: async function(this: types.IVForm): Promise<void> {
        this.dialogResult = await clickgo.form.dialog('Hello world!');
    },
    dialogLong: async function(this: types.IVForm): Promise<void> {
        this.dialogResult = await clickgo.form.dialog('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
    },
    dialogTitle: async function(this: types.IVForm): Promise<void> {
        this.dialogResult = await clickgo.form.dialog({
            'title': 'Title',
            'content': 'Hello world!'
        });
    },
    dialogButtons: async function(this: types.IVForm): Promise<void> {
        this.dialogResult = await clickgo.form.dialog({
            'content': 'Hello world!',
            'buttons': ['A', 'B', 'C']
        });
    },
    dialogCannot: async function(this: types.IVForm): Promise<void> {
        this.dialogResult = await clickgo.form.dialog({
            'content': 'Hello world!',
            'buttons': ['Do not close', 'Close'],
            'select': (e: Event, button: string): void => {
                if (button === 'Do not close') {
                    e.preventDefault();
                }
            }
        });
    },
    confirm: async function(this: types.IVForm, cancel: boolean): Promise<void> {
        this.dialogResult = await clickgo.form.confirm({
            'content': 'Hello world?',
            'cancel': cancel
        });
        if (typeof this.dialogResult === 'boolean') {
            this.dialogResult = this.dialogResult ? 'true (boolean)' : 'false (boolean)';
        }
        else {
            this.dialogResult = (this.dialogResult as number).toString() + ' (number)';
        }
    },
    setTopMost: function(this: types.IVForm): void {
        this.setTopMostValue = !this.setTopMostValue;
        clickgo.form.setTopMost(this.setTopMostValue);
    },
    flash: function(this: types.IVForm): void {
        clickgo.form.flash();
    },
    hide: async function(this: types.IVForm): Promise<void> {
        clickgo.form.hide();
        await clickgo.tool.sleep(1000);
        clickgo.form.show();
    }
};

export const receive = function(this: types.IVForm, obj: Record<string, any>): void {
    clickgo.form.dialog(JSON.stringify(obj)).catch((e) => { throw e; });
};

export const mounted = function(this: types.IVForm): void {
    this.fid = this.formId;
    this.tid = this.taskId;
};

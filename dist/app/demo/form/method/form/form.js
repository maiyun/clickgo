import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.fid = '0';
        this.tid = '0';
        this.type = ['primary'];
        this.atype = ['default'];
        this.progress = ['noraml'];
        this.dr = '';
        this.hash = 'hash' + clickgo.tool.rand(0, 100).toString();
        // --- 测试 data ---
        this.cdata = {
            'abc': '123',
        };
        this.cdatai = false;
    }
    min() {
        clickgo.form.min(this.formId);
    }
    max() {
        clickgo.form.max(this.formId);
    }
    close() {
        clickgo.form.close(this.formId);
    }
    bindResize(e) {
        clickgo.form.bindResize(e, 'rb');
    }
    bindDrag(e) {
        clickgo.form.bindDrag(e);
    }
    getTaskId() {
        clickgo.form.dialog(this, clickgo.form.getTaskId(this.fid).toString()).catch(() => { });
    }
    get() {
        clickgo.form.dialog(this, JSON.stringify(clickgo.form.get(this.fid))).catch(() => { });
    }
    async getHash() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.form.getHash(this.fid)));
    }
    async hashBack() {
        await clickgo.form.dialog(this, JSON.stringify(await clickgo.form.hashBack(this.fid)));
    }
    async tohash() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.form.hash(this.fid, this.hash)));
    }
    onFormHashChange(taskId, formId, value, data) {
        console.log('onFormHashChange', taskId, formId, value, data);
    }
    async getActivePanel() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.form.getActivePanel(this.fid)));
    }
    async getFocus() {
        const f = clickgo.form.getFocus();
        await clickgo.form.dialog(this, f ? f.toString() : 'null');
    }
    async changeFocus() {
        await clickgo.form.changeFocus(this.fid);
    }
    getList() {
        let str = JSON.stringify(clickgo.form.getList(this.tid));
        str = str.replace(/"icon":"(.*?)"/g, function (t, t1) {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        clickgo.form.dialog(this, `<flow direction="v" style="width: 200px; height: 80px;">${str}</flow>`).catch(() => { });
    }
    async getMaxZIndexID() {
        const fid = await clickgo.form.getMaxZIndexID(this);
        clickgo.form.dialog(this, JSON.stringify(fid)).catch(() => { });
    }
    getRectByBorder() {
        const size = clickgo.form.getRectByBorder('rb');
        clickgo.form.dialog(this, JSON.stringify(size)).catch(() => { });
    }
    showCircular(e) {
        clickgo.form.showCircular(e.clientX, e.clientY);
    }
    async showRectangle(e) {
        clickgo.form.showRectangle(e.clientX, e.clientY, 'rb');
        await clickgo.tool.sleep(1000);
        clickgo.form.hideRectangle();
    }
    async showDrag() {
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
    async notify() {
        let icon = null;
        if (this.progress[0] === 'progress + icon') {
            icon = await clickgo.fs.getContent(this, '/package/res/icon.svg');
        }
        if (icon instanceof Blob) {
            icon = await clickgo.tool.blob2DataUrl(icon);
        }
        const nid = clickgo.form.notify({
            'title': this.progress[0] === 'only content' ? undefined : 'Notify',
            'content': this.progress[0] === 'only title' ? undefined : 'Content',
            'note': this.progress[0] === 'has note' ? 'Note' : undefined,
            'type': this.type[0],
            'progress': (this.progress[0] === 'progress + icon') ? true : false,
            'icon': icon,
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
    alert() {
        const aid = clickgo.form.alert(this.atype[0], this.atype[0]);
        console.log('aid', aid);
    }
    showPop(e) {
        if (!e.currentTarget) {
            return;
        }
        clickgo.form.showPop(e.currentTarget, this.refs.pop, 'v');
    }
    async create() {
        const frm = await clickgo.form.create(this, 'test', undefined, {
            'path': this.filename
        });
        await frm.show();
    }
    async dialog() {
        this.dr = await clickgo.form.dialog(this, 'Hello world!');
    }
    async dialogLong() {
        this.dr = await clickgo.form.dialog(this, 'longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
    }
    async dialogTitle() {
        this.dr = await clickgo.form.dialog(this, {
            'title': 'Title',
            'content': 'Hello world!'
        });
    }
    async dialogButtons() {
        this.dr = await clickgo.form.dialog(this, {
            'content': 'Hello world!',
            'buttons': ['A', 'B', 'C']
        });
    }
    async dialogCannot() {
        this.dr = await clickgo.form.dialog(this, {
            'content': 'Hello world!',
            'buttons': ['Do not close', 'Close'],
            'select': (e, button) => {
                if (button === 'Do not close') {
                    e.preventDefault();
                }
            }
        });
    }
    async dialogData() {
        this.dr = await clickgo.form.dialog(this, {
            'direction': 'v',
            'gutter': 10,
            'content': '<block>Hello text!</block><text :modelValue="data.txt" />',
            'data': {
                'txt': 'Text\nLine 2.'
            }
        });
    }
    async confirm(cancel) {
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
    async prompt() {
        this.dr = await clickgo.form.prompt(this, 'test');
    }
    async flash() {
        await clickgo.form.flash(this, this.formId);
    }
    showLauncher() {
        clickgo.form.showLauncher();
    }
    onReceive(obj) {
        clickgo.form.dialog(this, JSON.stringify(obj)).catch(() => { });
    }
    onMounted() {
        this.fid = this.formId.toString();
        this.tid = this.taskId.toString();
    }
    get cdatad() {
        return (t) => {
            return this.cdatai ? t : 'none';
        };
    }
}

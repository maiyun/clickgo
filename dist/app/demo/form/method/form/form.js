"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.fid = '0';
        this.tid = '0';
        this.type = ['primary'];
        this.atype = ['default'];
        this.progress = ['noraml'];
        this.dr = '';
        this.hash = 'hash' + clickgo.tool.rand(0, 100).toString();
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
        clickgo.form.dialog(clickgo.form.getTaskId(parseInt(this.fid)).toString()).catch((e) => { throw e; });
    }
    get() {
        clickgo.form.dialog(JSON.stringify(clickgo.form.get(parseInt(this.fid)))).catch((e) => { throw e; });
    }
    async getHash() {
        await clickgo.form.dialog(JSON.stringify(clickgo.form.getHash(parseInt(this.fid))));
    }
    async hashBack() {
        await clickgo.form.dialog(JSON.stringify(await clickgo.form.hashBack(parseInt(this.fid))));
    }
    async tohash() {
        await clickgo.form.dialog(JSON.stringify(clickgo.form.hash(this.hash, parseInt(this.fid))));
    }
    async getActivePanel() {
        await clickgo.form.dialog(JSON.stringify(clickgo.form.getActivePanel(parseInt(this.fid))));
    }
    async getFocus() {
        const f = clickgo.form.getFocus();
        await clickgo.form.dialog(f ? f.toString() : 'null');
    }
    changeFocus() {
        clickgo.form.changeFocus(parseInt(this.fid));
    }
    getList() {
        let str = JSON.stringify(clickgo.form.getList(parseInt(this.tid)));
        str = str.replace(/"icon":"(.*?)"/g, function (t, t1) {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        clickgo.form.dialog(`<flow direction="v" style="width: 200px; height: 80px;">${str}</flow>`).catch((e) => { throw e; });
    }
    getMaxZIndexID() {
        const fid = clickgo.form.getMaxZIndexID();
        clickgo.form.dialog(JSON.stringify(fid)).catch((e) => { throw e; });
    }
    getRectByBorder() {
        const size = clickgo.form.getRectByBorder('rb');
        clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
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
    async notify() {
        let icon = null;
        if (this.progress[0] === 'progress + icon') {
            icon = await clickgo.fs.getContent('/package/res/icon.svg');
        }
        if (icon instanceof Blob) {
            icon = await clickgo.tool.blob2DataUrl(icon);
        }
        const nid = clickgo.form.notify({
            'title': this.progress[0] === 'only content' ? undefined : 'Notify',
            'content': this.progress[0] === 'only title' ? undefined : 'Content',
            'type': this.type[0],
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
        const frm = await clickgo.form.create('test', undefined, {
            'path': this.filename
        });
        frm.show();
    }
    async dialog() {
        this.dr = await clickgo.form.dialog('Hello world!');
    }
    async dialogLong() {
        this.dr = await clickgo.form.dialog('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
    }
    async dialogTitle() {
        this.dr = await clickgo.form.dialog({
            'title': 'Title',
            'content': 'Hello world!'
        });
    }
    async dialogButtons() {
        this.dr = await clickgo.form.dialog({
            'content': 'Hello world!',
            'buttons': ['A', 'B', 'C']
        });
    }
    async dialogCannot() {
        this.dr = await clickgo.form.dialog({
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
        this.dr = await clickgo.form.dialog({
            'direction': 'v',
            'gutter': 10,
            'content': '<block>Hello text!</block><text :modelValue="data.txt" />',
            'data': {
                'txt': 'Text\nLine 2.'
            }
        });
    }
    async confirm(cancel) {
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
    async prompt() {
        this.dr = await clickgo.form.prompt('test');
    }
    flash() {
        clickgo.form.flash(this.formId);
    }
    showLauncher() {
        clickgo.form.showLauncher();
    }
    onReceive(obj) {
        clickgo.form.dialog(JSON.stringify(obj)).catch((e) => { throw e; });
    }
    onMounted() {
        this.fid = this.formId.toString();
        this.tid = this.taskId.toString();
    }
}
exports.default = default_1;

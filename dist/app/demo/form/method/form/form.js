"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.fid = '0';
        this.sendValue = 'sendValue';
        this.tid = '0';
        this.type = 'primary';
        this.progress = 'noraml';
        this.dr = '';
        this.setTopMostValue = false;
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
    send() {
        clickgo.form.send(parseInt(this.fid), {
            'key': this.sendValue
        });
    }
    changeFocus() {
        clickgo.form.changeFocus(parseInt(this.fid));
    }
    getList() {
        let str = JSON.stringify(clickgo.form.getList(this.taskId));
        str = str.replace(/"icon":"(.*?)"/g, function (t, t1) {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        clickgo.form.dialog(`<overflow direction="v" style="width: 200px; height: 80px;">${str}</overflow>`).catch((e) => { throw e; });
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
    showRectangle(e) {
        return __awaiter(this, void 0, void 0, function* () {
            clickgo.form.showRectangle(e.clientX, e.clientY, 'rb');
            yield clickgo.tool.sleep(1000);
            clickgo.form.hideRectangle();
        });
    }
    showDrag() {
        return __awaiter(this, void 0, void 0, function* () {
            clickgo.form.showDrag();
            const rect = this.refs.showDrag.$el.getBoundingClientRect();
            clickgo.form.moveDrag({
                'left': rect.left,
                'top': rect.top,
                'width': rect.width,
                'height': rect.height
            });
            yield clickgo.tool.sleep(1000);
            clickgo.form.hideDrag();
        });
    }
    notify() {
        return __awaiter(this, void 0, void 0, function* () {
            let icon = null;
            if (this.progress === 'progress + icon') {
                icon = yield clickgo.fs.getContent('/package/res/icon.svg');
            }
            if (icon instanceof Blob) {
                icon = yield clickgo.tool.blob2DataUrl(icon);
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
                yield clickgo.tool.sleep(1000);
                clickgo.form.notifyProgress(nid, 30);
                yield clickgo.tool.sleep(300);
                clickgo.form.notifyProgress(nid, 50);
                yield clickgo.tool.sleep(700);
                clickgo.form.notifyProgress(nid, 75);
                yield clickgo.tool.sleep(1000);
                clickgo.form.notifyProgress(nid, 100);
            }
        });
    }
    showPop(e) {
        if (!e.currentTarget) {
            return;
        }
        clickgo.form.showPop(e.currentTarget, this.refs.pop, 'v');
    }
    createParam() {
        clickgo.form.create({
            'layout': '<form width=\'300\' height=\'300\' title=\'normal\'></form>'
        }).catch((e) => { throw e; });
    }
    createPath() {
        this.createForm('test').then((e) => { console.log(e); }).catch((e) => { throw e; });
    }
    createTop() {
        return __awaiter(this, void 0, void 0, function* () {
            const frm = yield this.createForm('test');
            if (typeof frm === 'number') {
                return;
            }
            frm.topMost = true;
        });
    }
    dialog() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dr = yield clickgo.form.dialog('Hello world!');
        });
    }
    dialogLong() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dr = yield clickgo.form.dialog('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
        });
    }
    dialogTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dr = yield clickgo.form.dialog({
                'title': 'Title',
                'content': 'Hello world!'
            });
        });
    }
    dialogButtons() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dr = yield clickgo.form.dialog({
                'content': 'Hello world!',
                'buttons': ['A', 'B', 'C']
            });
        });
    }
    dialogCannot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dr = yield clickgo.form.dialog({
                'content': 'Hello world!',
                'buttons': ['Do not close', 'Close'],
                'select': (e, button) => {
                    if (button === 'Do not close') {
                        e.preventDefault();
                    }
                }
            });
        });
    }
    confirm(cancel) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dr = yield clickgo.form.confirm({
                'content': 'Hello world?',
                'cancel': cancel
            });
            if (typeof this.dr === 'boolean') {
                this.dr = this.dr ? 'true (boolean)' : 'false (boolean)';
            }
            else {
                this.dr = this.dr.toString() + ' (number)';
            }
        });
    }
    setTopMost() {
        this.setTopMostValue = !this.setTopMostValue;
        this.topMost = this.setTopMostValue;
    }
    flash() {
        clickgo.form.flash(this.formId);
    }
    hhide() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hide();
            yield clickgo.tool.sleep(1000);
            this.show();
        });
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

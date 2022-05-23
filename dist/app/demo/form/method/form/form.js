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
exports.mounted = exports.receive = exports.methods = exports.data = void 0;
const clickgo = require("clickgo");
exports.data = {
    'fid': '0',
    'sendValue': 'sendValue',
    'tid': '0',
    'type': 'primary',
    'progress': 'noraml',
    'dialogResult': '',
    'setTopMostValue': false
};
exports.methods = {
    min: function () {
        clickgo.form.min();
    },
    max: function () {
        clickgo.form.max();
    },
    close: function () {
        clickgo.form.close();
    },
    bindResize: function (e) {
        clickgo.form.bindResize(e, 'rb');
    },
    bindDrag: function (e) {
        clickgo.form.bindDrag(e);
    },
    getTaskId: function () {
        clickgo.form.dialog(clickgo.form.getTaskId(parseInt(this.fid)).toString()).catch((e) => { throw e; });
    },
    get: function () {
        clickgo.form.dialog(JSON.stringify(clickgo.form.get(parseInt(this.fid)))).catch((e) => { throw e; });
    },
    send: function () {
        clickgo.form.send(parseInt(this.fid), {
            'key': this.sendValue
        });
    },
    changeFocus: function () {
        clickgo.form.changeFocus(parseInt(this.fid));
    },
    getList: function () {
        let str = JSON.stringify(clickgo.form.getList(this.taskId));
        str = str.replace(/"icon":"(.*?)"/g, function (t, t1) {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        clickgo.form.dialog(`<overflow direction="v" style="width: 200px; height: 80px;">${str}</overflow>`).catch((e) => { throw e; });
    },
    getMaxZIndexID: function () {
        const fid = clickgo.form.getMaxZIndexID();
        clickgo.form.dialog(JSON.stringify(fid)).catch((e) => { throw e; });
    },
    getRectByBorder: function () {
        const size = clickgo.form.getRectByBorder('rb');
        clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
    },
    showCircular: function (e) {
        clickgo.form.showCircular(e.clientX, e.clientY);
    },
    showRectangle: function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            clickgo.form.showRectangle(e.clientX, e.clientY, 'rb');
            yield clickgo.tool.sleep(1000);
            clickgo.form.hideRectangle();
        });
    },
    showDrag: function () {
        return __awaiter(this, void 0, void 0, function* () {
            clickgo.form.showDrag();
            const rect = this.$refs.showDrag.$el.getBoundingClientRect();
            clickgo.form.moveDrag({
                'left': rect.left,
                'top': rect.top,
                'width': rect.width,
                'height': rect.height
            });
            yield clickgo.tool.sleep(1000);
            clickgo.form.hideDrag();
        });
    },
    notify: function () {
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
    },
    showPop: function (e) {
        if (!e.currentTarget) {
            return;
        }
        clickgo.form.showPop(e.currentTarget, this.$refs.pop, 'v');
    },
    createParam: function () {
        clickgo.form.create({
            'layout': '<form width=\'300\' height=\'300\' title=\'normal\'></form>'
        }).catch((e) => { throw e; });
    },
    createPath: function () {
        clickgo.form.create('test').then((e) => { console.log(e); }).catch((e) => { throw e; });
    },
    createTop: function () {
        clickgo.form.create({
            'layout': '<form width=\'300\' height=\'300\' title=\'normal\'></form>',
            'topMost': true
        }).catch((e) => { throw e; });
    },
    dialog: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialogResult = yield clickgo.form.dialog('Hello world!');
        });
    },
    dialogLong: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialogResult = yield clickgo.form.dialog('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');
        });
    },
    dialogTitle: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialogResult = yield clickgo.form.dialog({
                'title': 'Title',
                'content': 'Hello world!'
            });
        });
    },
    dialogButtons: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialogResult = yield clickgo.form.dialog({
                'content': 'Hello world!',
                'buttons': ['A', 'B', 'C']
            });
        });
    },
    dialogCannot: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialogResult = yield clickgo.form.dialog({
                'content': 'Hello world!',
                'buttons': ['Do not close', 'Close'],
                'select': (e, button) => {
                    if (button === 'Do not close') {
                        e.preventDefault();
                    }
                }
            });
        });
    },
    confirm: function (cancel) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialogResult = yield clickgo.form.confirm({
                'content': 'Hello world?',
                'cancel': cancel
            });
            if (typeof this.dialogResult === 'boolean') {
                this.dialogResult = this.dialogResult ? 'true (boolean)' : 'false (boolean)';
            }
            else {
                this.dialogResult = this.dialogResult.toString() + ' (number)';
            }
        });
    },
    setTopMost: function () {
        this.setTopMostValue = !this.setTopMostValue;
        clickgo.form.setTopMost(this.setTopMostValue);
    },
    flash: function () {
        clickgo.form.flash();
    },
    hide: function () {
        return __awaiter(this, void 0, void 0, function* () {
            clickgo.form.hide();
            yield clickgo.tool.sleep(1000);
            clickgo.form.show();
        });
    }
};
const receive = function (obj) {
    clickgo.form.dialog(JSON.stringify(obj)).catch((e) => { throw e; });
};
exports.receive = receive;
const mounted = function () {
    this.fid = this.formId;
    this.tid = this.taskId;
};
exports.mounted = mounted;

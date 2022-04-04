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
exports.methods = exports.data = void 0;
exports.data = {
    'fid': '',
    'type': 'primary',
    'progress': 'noraml'
};
exports.methods = {
    getAvailArea: function () {
        this.cgDialog(JSON.stringify(clickgo.form.getAvailArea(), undefined, 4)).catch((e) => { throw e; });
    },
    getList: function () {
        const str = JSON.stringify(clickgo.form.getList(this.taskId))
            .replace(/"icon":"(.*?)"/g, function (t, t1) {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        this.cgDialog(`<overflow direction="v" style="width: 200px; height: 80px;">${str}</overflow>`).catch((e) => { throw e; });
    },
    changeFocus: function (formId) {
        clickgo.form.changeFocus(parseInt(formId));
    },
    getMaxZIndexFormID: function () {
        return clickgo.form.getMaxZIndexFormID();
    },
    showCircular: function (e) {
        clickgo.form.showCircular(e.clientX, e.clientY);
    },
    showRectangle: function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            clickgo.form.showRectangle(e.clientX, e.clientY, 't');
            yield clickgo.tool.sleep(1000);
            clickgo.form.hideRectangle();
        });
    },
    send: function () {
        clickgo.form.send(this.formId, { 'x': 'yes' });
    },
    cgReceive: function (obj) {
        this.cgDialog(JSON.stringify(obj));
    },
    notify: function () {
        return __awaiter(this, void 0, void 0, function* () {
            let icon = undefined;
            if (this.progress === 'progress + icon') {
                icon = yield this.cgGetDataUrl('/res/icon.svg');
                if (!icon) {
                    icon = undefined;
                }
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
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    'fid': '',
    'type': 'primary'
};
exports.methods = {
    getAvailArea: function () {
        this.cgDialog(JSON.stringify(clickgo.form.getAvailArea(), undefined, 4)).catch((e) => { throw e; });
    },
    getList: function () {
        let str = JSON.stringify(clickgo.form.getList(this.taskId)).replace(/"icon":"(.*?)"/g, function (t, t1) {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        this.cgDialog(`<overflow width="200" height="100" direction="v" style="word-break: break-word;">${str}</overflow>`).catch((e) => { throw e; });
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
        clickgo.form.showRectangle(e.clientX, e.clientY, 't');
        this.cgCreateTimer(() => {
            clickgo.form.hideRectangle();
        }, 1000);
    },
    notify: function () {
        clickgo.form.notify({
            'title': 'Notify',
            'content': 'Content',
            'type': this.type
        });
    }
};

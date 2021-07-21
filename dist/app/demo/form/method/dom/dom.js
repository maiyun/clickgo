"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = void 0;
exports.computed = {
    'isMove': function () {
        return clickgo.dom.is.move;
    }
};
exports.methods = {
    setGlobalCursor: function (type) {
        clickgo.dom.setGlobalCursor(type);
    },
    isMouseAlsoTouchEvent: function (e) {
        clickgo.dom.isMouseAlsoTouchEvent(e);
    },
    getStyleCount: function () {
        this.cgDialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    }
};

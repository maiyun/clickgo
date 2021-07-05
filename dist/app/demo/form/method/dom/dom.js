"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
exports.methods = {
    setGlobalCursor: function (type) {
        clickgo.dom.setGlobalCursor(type);
    },
    isMouseAlsoTouchEvent: function (e) {
        clickgo.dom.isMouseAlsoTouchEvent(e);
    }
};

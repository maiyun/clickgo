"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
exports.methods = {
    cgShowHide: function () {
        this.cgHide();
        setTimeout(() => {
            this.cgShow();
        }, 1000);
    }
};

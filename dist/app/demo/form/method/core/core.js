"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    'nativeListeners': []
};
exports.methods = {
    getNativeListeners: function () {
        const list = clickgo.core.getNativeListeners();
        this.nativeListeners = [];
        for (const item of list) {
            this.nativeListeners.push(`name: ${item.name}[${item.id}], once: ${(item.once ? 'true' : 'false')}`);
        }
    }
};

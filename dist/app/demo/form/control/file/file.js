"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    'accept': 'txt',
    'multi': 'false',
    'dir': 'false',
    'list': []
};
exports.methods = {
    select: function () {
        this.$refs.file.select();
    },
    change: function (files) {
        this.list = [];
        if (!files) {
            return;
        }
        for (const file of files) {
            this.list.push((file.webkitRelativePath || file.name) + ' (' + file.size.toString() + ')');
        }
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.list = [];
    }
    onLauncherFolderNameChanged(id, name) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': 'launcherFolderNameChanged',
            'content': JSON.stringify({
                'id': id,
                'name': name
            })
        });
    }
    onHashChanged(hash) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': 'hashChanged',
            'content': hash
        });
    }
}
exports.default = default_1;

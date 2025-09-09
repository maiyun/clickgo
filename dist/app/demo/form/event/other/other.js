import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
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
    onKeydown(e) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': 'keydown',
            'content': e.key
        });
    }
    onKeyup(e) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': 'keyup',
            'content': e.key
        });
    }
}

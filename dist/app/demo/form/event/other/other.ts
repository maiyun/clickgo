import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public list: any[] = [];

    public onLauncherFolderNameChanged(id: string, name: string): void {
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

    public onHashChanged(hash: string): void {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': 'hashChanged',
            'content': hash
        });
    }

}

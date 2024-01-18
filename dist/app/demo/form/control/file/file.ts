import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public accept = 'txt';

    public multi = 'false';

    public dir = 'false';

    public list: string[] = [];

    public fd = new FormData();

    public select(): void {
        this.refs.file.select();
    }

    public change(files: FileList | null): void {
        this.list = [];
        if (!files) {
            return;
        }
        for (const file of files) {
            this.list.push((file.webkitRelativePath || file.name) + ' (' + file.size.toString() + ')');
            this.fd.append('file', file, file.name);
        }
    }

}

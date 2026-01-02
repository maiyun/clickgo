import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    accept = 'txt';
    multi = 'false';
    dir = 'false';
    list = [];
    fd = new FormData();
    select() {
        this.refs.file.select();
    }
    change(files) {
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

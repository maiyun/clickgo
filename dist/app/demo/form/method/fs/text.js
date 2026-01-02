import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    title = 'Text viewer';
    content = '';
    onMounted(obj) {
        this.title = obj.title + ' - Text viewer';
        this.content = obj.content;
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.title = 'Text viewer';
        this.content = '';
    }
    onMounted(obj) {
        this.title = obj.title + ' - Text viewer';
        this.content = obj.content;
    }
}

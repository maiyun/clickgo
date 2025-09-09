import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.value = '';
        this.mode = ['hsl'];
        this.value2 = '';
        this.disabled = false;
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.text = 'a**b**c';
        this.size = ['12px'];
        this.family = false;
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.plain = false;
        this.bg = ['dot'];
    }
}

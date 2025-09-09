import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.drawer = false;
        this.drawer2 = false;
        this.tclose = false;
    }
}

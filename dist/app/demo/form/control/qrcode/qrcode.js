import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.text = 'test123';
        this.width = [200];
        this.margin = [4];
    }
}

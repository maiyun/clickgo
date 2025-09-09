import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.gutter = [0];
        this.igutter = [0];
        this.direction = ['h'];
    }
}

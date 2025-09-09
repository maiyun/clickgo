import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.src = [
            '../../../res/img.jpg', '../../../res/icon.svg'
        ];
        this.value = 0;
    }
}

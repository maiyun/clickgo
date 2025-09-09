import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'close': null
        };
    }
    click() {
        this.emit('close');
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'close': null
    };
    click() {
        this.emit('close');
    }
}

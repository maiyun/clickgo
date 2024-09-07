import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'close': null
    };

    public click(): void {
        this.emit('close');
    }

}

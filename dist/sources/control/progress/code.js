import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'update:modelValue': null,
        };
        this.props = {
            'modelValue': 0,
            'type': 'default',
        };
    }
}

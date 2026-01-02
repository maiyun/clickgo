import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:modelValue': null,
    };
    props = {
        'modelValue': 0,
        'type': 'default',
    };
}

import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null,
    };

    public props: {
        'modelValue': number | string;
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger';
    } = {
            'modelValue': 0,
            'type': 'default',
        };

}

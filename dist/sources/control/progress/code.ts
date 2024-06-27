import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null
    };

    public props: {
        'modelValue': number | string;
    } = {
            'modelValue': 0,
        };

}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'border': true,
        'plain': false,
        'stripe': false,
        'collapse': true,
        'size': 'm',
        'outside': true
    };
}

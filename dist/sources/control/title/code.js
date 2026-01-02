import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:arrow': null,
    };
    props = {
        'type': 'default',
        'arrow': undefined
    };
}

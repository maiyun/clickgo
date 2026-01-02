import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'disabled': false,
        'plain': false,
        'type': 'default',
        'size': 'm'
    };
    /** --- 子组件 --- */
    itemsLength = 0;
}

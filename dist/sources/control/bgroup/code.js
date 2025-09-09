import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'plain': false,
            'type': 'default',
            'size': 'm'
        };
        /** --- 子组件 --- */
        this.itemsLength = 0;
    }
}

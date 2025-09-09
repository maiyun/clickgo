import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'update:arrow': null,
        };
        this.props = {
            'type': 'default',
            'arrow': undefined
        };
    }
}

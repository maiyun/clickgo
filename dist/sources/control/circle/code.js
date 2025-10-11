import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'type': 'default',
            'plain': false,
            'sub': false,
            'size': 's',
        };
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'border': true,
            'plain': false,
            'collapse': true,
            'size': 'm'
        };
    }
}

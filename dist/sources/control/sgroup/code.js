import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'h',
            'type': 'default',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };
    }
}

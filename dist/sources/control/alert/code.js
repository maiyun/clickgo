import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'close': null
        };
        this.props = {
            'type': 'default',
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'close': false,
            'title': ''
        };
    }
}

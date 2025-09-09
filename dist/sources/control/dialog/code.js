import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'select': null,
        };
        this.props = {
            'direction': 'h',
            'gutter': '',
            'width': undefined,
            'height': undefined,
            'padding': true,
            'buttons': ['OK'],
        };
    }
    click(item) {
        this.emit('select', item);
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'select': null,
    };
    props = {
        'direction': 'h',
        'gutter': '',
        'width': undefined,
        'height': undefined,
        'padding': true,
        'buttons': ['OK'],
    };
    click(item) {
        this.emit('select', item);
    }
}

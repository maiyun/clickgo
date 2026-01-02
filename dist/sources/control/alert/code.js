import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'close': null
    };
    props = {
        'type': 'default',
        'direction': 'h',
        'gutter': '',
        'alignH': undefined,
        'alignV': undefined,
        'close': false,
        'title': ''
    };
}

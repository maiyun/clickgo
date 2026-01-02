import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'h',
        'gutter': '',
        'alignH': undefined,
        'alignV': 'center',
        'title': '',
        'note': ''
    };
}

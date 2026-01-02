import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'h',
        'type': 'default',
        'gutter': '',
        'alignH': undefined,
        'alignV': undefined
    };
}

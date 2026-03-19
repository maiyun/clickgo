import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'h',
        'gutter': undefined,
        'alignH': undefined,
        'alignV': undefined,
        'wrap': false
    };
}

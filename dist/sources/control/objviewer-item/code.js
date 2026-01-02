import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'hue': '255',
        'hover': false,
        'direction': 'h',
        'border': 'solid',
        'gutter': '',
        'alignH': undefined,
        'alignV': undefined,
        'label': '',
    };
}

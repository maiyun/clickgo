import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'title': '',
        'plain': false,
        'hover': false,
        'direction': 'h',
        'gutter': '',
        'alignH': undefined,
        'alignV': undefined,
        'padding': true,
        'position': 'top',
        'type': 'default',
        'hue': undefined,
    };
}

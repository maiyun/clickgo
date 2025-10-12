import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
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
}

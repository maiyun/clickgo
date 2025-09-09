import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };
        this.size = 's';
    }
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
            this.size = this.element.offsetWidth < 600 ? 's' : 'm';
        }, true);
    }
}

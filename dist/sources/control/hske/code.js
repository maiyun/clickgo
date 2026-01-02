import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'h',
        'gutter': '',
        'alignH': undefined,
        'alignV': undefined
    };
    size = 's';
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
            this.size = this.element.offsetWidth < 600 ? 's' : 'm';
        }, true);
    }
}

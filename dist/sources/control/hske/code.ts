import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
    } = {
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };

    public size = 's';

    public onMounted(): void | Promise<void> {
        clickgo.dom.watchSize(this.element, () => {
            this.size = this.element.offsetWidth < 600 ? 's' : 'm';
        }, true);
    }

}

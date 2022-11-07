import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public padding: string = '';

    public props = {
        'direction': 'h',
        'gutter': '',

        'buttons': ['OK']
    };

    public get paddingMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public click(item: string): void {
        this.emit('select', item);
    }

    public onMounted(): void {
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
    }

}

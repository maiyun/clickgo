import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public alayout: any = null;

    public props: {
        'span': number | string;
        'alignH'?: string;
        'alignV'?: string;
    } = {
            'span': 1,
            'alignH': undefined,
            'alignV': undefined
        };

    public get colWidth(): string {
        const pcw = this.alayout?.colWidth ?? 100;
        let cw = pcw * this.propInt('span');
        if (cw > 100) {
            cw = 100;
        }
        const gutter: number = this.alayout?.propNumber === undefined ? 0 : this.alayout?.propNumber('gutter');
        if (!gutter) {
            return cw.toString() + '%';
        }
        return 'calc(' + cw.toString() + '% - ' + gutter.toString() + 'px)';
    }

    public get gutter(): string {
        const gutter: number = this.alayout?.propNumber === undefined ? 0 : this.alayout?.propNumber('itemGutter');
        return gutter.toString() + 'px';
    }

    public get direction(): string {
        return this.alayout?.props?.direction ?? 'h';
    }

    public onMounted(): void {
        this.alayout = this.parentByName('alayout');
    }

}

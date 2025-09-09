import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.alayout = null;
        this.props = {
            'span': 1,
            'alignH': undefined,
            'alignV': undefined
        };
    }
    get colWidth() {
        const pcw = this.alayout?.colWidth ?? 100;
        let cw = pcw * this.propInt('span');
        if (cw > 100) {
            cw = 100;
        }
        const gutter = this.alayout?.propNumber === undefined ? 0 : this.alayout?.propNumber('gutter');
        if (!gutter) {
            return cw.toString() + '%';
        }
        return 'calc(' + cw.toString() + '% - ' + gutter.toString() + 'px)';
    }
    get gutter() {
        const gutter = this.alayout?.propNumber === undefined ? 0 : this.alayout?.propNumber('itemGutter');
        return gutter.toString() + 'px';
    }
    get direction() {
        return this.alayout?.props?.direction ?? 'h';
    }
    onMounted() {
        this.alayout = this.parentByName('alayout');
    }
}

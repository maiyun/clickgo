import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'h',
            'gutter': 0,
            'itemGutter': 0,
            'alignH': undefined,
            'alignV': undefined,
            'sizeM': 0,
            'sizeL': 0,
        };
        /** --- 整个宽度 --- */
        this.width = 0;
        /** --- 当前的大小模式 --- */
        this.size = 's';
    }
    /** --- 一行排几列 --- */
    get columns() {
        if (this.width >= 1000) {
            this.size = 'l';
            return this.propInt('sizeL') || 4;
        }
        if (this.width >= 600) {
            this.size = 'm';
            return this.propInt('sizeM') || 2;
        }
        this.size = 's';
        return 1;
    }
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
            this.width = this.element.offsetWidth;
        }, true);
    }
}

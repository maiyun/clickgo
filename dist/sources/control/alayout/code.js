import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'h',
            'gutter': 0,
            'itemGutter': 0
        };
        /** --- 列宽百分比，如 88 --- */
        this.colWidth = 0;
    }
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
            const w = this.element.offsetWidth;
            /** --- 每行几个 --- */
            const celCount = Math.floor(w / 200);
            this.colWidth = 100 / celCount;
        }, true);
    }
}

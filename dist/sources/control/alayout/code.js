import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'h',
        'gutter': 0,
        'itemGutter': 0,
        'stripe': false,
    };
    /** --- 列宽百分比，如 88 --- */
    colWidth = 0;
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
            const w = this.element.offsetWidth;
            /** --- 每行几个 --- */
            const celCount = Math.floor(w / 200);
            this.colWidth = 100 / celCount;
        }, true);
    }
}

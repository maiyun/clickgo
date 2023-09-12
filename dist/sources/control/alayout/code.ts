import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        // --- 子项 cell 的排序方式 ---
        'direction': 'h' | 'v';
        'gutter': number | string;
        'itemGutter': number | string;
    } = {
            'direction': 'h',
            'gutter': 0,
            'itemGutter': 0
        };

    /** --- 列宽百分比，如 88 --- */
    public colWidth = 0;

    public onMounted(): void {
        clickgo.dom.watchSize(this.element, () => {
            const w = this.element.offsetWidth;
            /** --- 每行几个 --- */
            const celCount = Math.floor(w / 200);
            this.colWidth = 100 / celCount;
        }, true);
    }

}

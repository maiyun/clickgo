import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'h',
        'gutter': 0,
        'itemGutter': 0,
        'alignH': undefined,
        'alignV': undefined,
        'dense': true,
    };
    /** --- 整个宽度 --- */
    width = 0;
    /** --- 最大横跨列数 --- */
    get maxSpan() {
        return Math.floor(this.width / 250) || 1;
    }
    /** --- 最后一个元素横跨的列数 --- */
    last = 1;
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
            // --- 宽度变化 ---
            this.width = this.element.offsetWidth;
            // --- 更新最后一个元素横跨的列数 ---
            /** --- 总 span --- */
            let spanCount = 0;
            /** --- 每行最大列数 --- */
            const lineCell = Math.floor(this.width / 250);
            for (const cell of this.element.children) {
                if (!cell.nextElementSibling) {
                    // --- 最后一个元素，不计入 ---
                    break;
                }
                const span = parseInt(cell.dataset.cgSpan ?? '0');
                if (span > 0) {
                    spanCount += span;
                }
            }
            this.last = lineCell - (spanCount % lineCell);
        }, true);
    }
}

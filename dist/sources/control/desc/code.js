import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'border': true,
        'plain': false,
        'stripe': false,
        'collapse': true,
        'size': 'm',
        'outside': true,
        'rowlr': false,
    };
    /** --- 总长度 --- */
    length = 0;
    /** --- 可见长度 --- */
    client = 0;
    /** --- 滚动偏移量 --- */
    offset = 0;
    /** --- 纵向滚动条的滚动事件 --- */
    roll() {
        this.refs.inner.scrollTop = this.offset;
    }
    /** --- 滚动处理 --- */
    scrollHandler() {
        this.offset = this.refs.inner.scrollTop;
    }
    onMounted() {
        // --- 容器大小改变 ---
        clickgo.dom.watchSize(this, this.refs.inner, () => {
            this.client = this.refs.inner.clientHeight;
        }, true);
        // --- 内容大小改变 ---
        clickgo.dom.watchSize(this, this.refs.table, () => {
            this.length = this.refs.table.offsetHeight;
        }, true);
    }
}

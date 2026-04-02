import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- 是否显示外围内部的所有的边框 --- */
        'border': boolean | string;
        /** --- 是否显示轻量边框 --- */
        'plain': boolean | string;
        /** --- 是否显示斑马纹 --- */
        'stripe': boolean | string;
        /** --- 是否折叠边框 --- */
        'collapse': boolean | string;
        /** --- 尺寸 --- */
        'size': 's' | 'm' | 'l' | 'xl';
        /** --- 是否显示外围边框 --- */
        'outside': boolean | string;
        /** --- 每行中每个 cell 是否显示左右边框 --- */
        'rowlr': boolean | string;
    } = {
            'border': true,
            'plain': false,
            'stripe': false,
            'collapse': true,
            'size': 'm',
            'outside': true,
            'rowlr': true,
        };

    /** --- 总长度 --- */
    public length: number = 0;

    /** --- 可见长度 --- */
    public client: number = 0;

    /** --- 滚动偏移量 --- */
    public offset: number = 0;

    /** --- 横向总宽度 --- */
    public lengthh: number = 0;

    /** --- 横向可见宽度 --- */
    public clienth: number = 0;

    /** --- 横向滚动偏移量 --- */
    public offseth: number = 0;

    /** --- 纵向滚动条的滚动事件 --- */
    public roll(): void {
        this.refs.inner.scrollTop = this.offset;
    }

    /** --- 横向滚动条的滚动事件 --- */
    public rollh(): void {
        this.refs.inner.scrollLeft = this.offseth;
    }

    /** --- 滚动处理 --- */
    public scrollHandler(): void {
        this.offset = this.refs.inner.scrollTop;
        this.offseth = this.refs.inner.scrollLeft;
    }

    public onMounted(): void {
        // --- 容器大小改变 ---
        clickgo.dom.watchSize(this, this.refs.inner, () => {
            this.client = this.refs.inner.clientHeight;
            this.clienth = this.refs.inner.clientWidth;
        }, true);

        // --- 内容大小改变 ---
        clickgo.dom.watchSize(this, this.refs.table, () => {
            this.length = this.refs.table.offsetHeight;
            this.lengthh = this.refs.table.offsetWidth;
        }, true);
    }

}

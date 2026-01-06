import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'gutter': number | string;
    } = {
            'gutter': '',
        };

    public async down(e: PointerEvent): Promise<void> {
        const el = e.target as HTMLElement;
        if (el.dataset.cgEfno !== undefined) {
            return;
        }
        if (clickgo.dom.findParentByData(el, 'cg-efno')) {
            return;
        }
        e.stopPropagation();
        clickgo.modules.pointer.move(e, {
            move: (e, detail): void => {
                this.refs.left.scrollTop -= detail.oy;
                this.refs.left.scrollLeft -= detail.ox;
            }
        });
        await clickgo.form.doFocusAndPopEvent(e);
    }

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
        this.refs.left.scrollTop = this.offset;
    }

    /** --- 横向滚动条的滚动事件 --- */
    public rollh(): void {
        this.refs.left.scrollLeft = this.offseth;
    }

    /** --- 滚动处理 --- */
    public scrollHandler(): void {
        this.offset = this.refs.left.scrollTop;
        this.offseth = this.refs.left.scrollLeft;
    }

    public onMounted(): void {
        // --- 容器大小改变 ---
        clickgo.dom.watchSize(this, this.refs.left, () => {
            this.client = this.refs.left.clientHeight;
            this.clienth = this.refs.left.clientWidth;
        }, true);

        // --- 内容大小改变 ---
        clickgo.dom.watchSize(this, this.refs.inner, () => {
            this.length = this.refs.inner.offsetHeight;
            this.lengthh = this.refs.inner.offsetWidth;
        }, true);
    }

}

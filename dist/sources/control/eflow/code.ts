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
            'object': e.currentTarget as HTMLElement,
            move: (e, o): void => {
                this.refs.left.scrollTop -= o.oy;
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

    public roll(): void {
        this.refs.left.scrollTop = this.offset;
    }

    public onMounted(): void {
        // --- 大小改变，会影响 scroll offset、client，也会影响 length ---
        clickgo.dom.watchSize(this, this.refs.left, () => {
            this.client = this.refs.left.clientHeight;
        }, true);

        // --- 内容改变 ---
        clickgo.dom.watchProperty(this.refs.left, ['scrollHeight', 'scrollTop'], (name, val) => {
            if (name === 'scrollTop') {
                this.offset = val;
                return;
            }
            this.length = val;
        }, true);
    }

}

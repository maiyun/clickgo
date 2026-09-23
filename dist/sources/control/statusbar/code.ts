import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- border，是否显示状态栏顶部的分隔线 --- */
        'border': boolean | string;
        /** --- separator，是否显示状态项之间的左右分隔线 --- */
        'separator': boolean | string;
        /** --- plain，是否使用透明背景显示状态栏 --- */
        'plain': boolean | string;
        /** --- scroll，内容超出时是否允许横向滚动 --- */
        'scroll': boolean | string;
    } = {
            'border': true,
            'separator': true,
            'plain': false,
            'scroll': true
        };

    /** --- 左侧是否还有未显示的状态项 --- */
    public scrollStart = false;

    /** --- 右侧是否还有未显示的状态项 --- */
    public scrollEnd = false;

    /**
     * --- 刷新横向滚动提示状态 ---
     * @returns void
     */
    public refreshScroll(): void {
        const body = this.refs.body;
        const max = body.scrollWidth - body.clientWidth;
        const scroll = this.propBoolean('scroll') && (max > 1);
        const offset = clickgo.dom.getScrollInlineOffset(body);
        this.scrollStart = scroll && (offset > 1);
        this.scrollEnd = scroll && (offset < (max - 1));
    }

    /**
     * --- 将鼠标滚轮转换为状态栏横向滚动 ---
     * @param event 滚轮事件
     * @returns void
     */
    public wheel(event: WheelEvent): void {
        const delta = event.deltaX || event.deltaY;
        if (!this.propBoolean('scroll') || !delta) {
            return;
        }
        const body = this.refs.body;
        if (body.scrollWidth <= body.clientWidth) {
            return;
        }
        event.preventDefault();
        clickgo.dom.setScrollLeft(body, clickgo.dom.getScrollLeft(body) + delta);
    }

    public onMounted(): void {
        const body = this.refs.body;
        clickgo.dom.watchSize(this, body, () => {
            this.refreshScroll();
        }, true);
        clickgo.dom.watchProperty(body, 'scrollWidth', () => {
            this.refreshScroll();
        });
        this.watch('scroll', () => {
            this.refreshScroll();
        });
        this.watch('locale', () => {
            this.refreshScroll();
        });
    }

}

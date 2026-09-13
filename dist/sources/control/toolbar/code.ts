import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- border，是否显示工具栏底部分隔线 --- */
        'border': boolean | string;
        /** --- plain，是否使用透明背景 --- */
        'plain': boolean | string;
        /** --- scroll，内容超出时是否允许横向滚动 --- */
        'scroll': boolean | string;
    } = {
            'border': true,
            'plain': false,
            'scroll': true
        };

    /** --- 左侧是否还有未显示的命令 --- */
    public scrollStart = false;

    /** --- 右侧是否还有未显示的命令 --- */
    public scrollEnd = false;

    /**
     * --- 刷新横向滚动提示状态 ---
     * @returns void
     */
    public refreshScroll(): void {
        const body = this.refs.body;
        const max = body.scrollWidth - body.clientWidth;
        const scroll = this.propBoolean('scroll') && (max > 1);
        this.scrollStart = scroll && (body.scrollLeft > 1);
        this.scrollEnd = scroll && (body.scrollLeft < (max - 1));
    }

    /**
     * --- 将鼠标滚轮转换为工具栏横向滚动 ---
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
        body.scrollLeft += delta;
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
    }

}

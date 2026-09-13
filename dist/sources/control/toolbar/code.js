import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'border': true,
        'plain': false,
        'scroll': true
    };
    /** --- 左侧是否还有未显示的命令 --- */
    scrollStart = false;
    /** --- 右侧是否还有未显示的命令 --- */
    scrollEnd = false;
    /**
     * --- 刷新横向滚动提示状态 ---
     * @returns void
     */
    refreshScroll() {
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
    wheel(event) {
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
    onMounted() {
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

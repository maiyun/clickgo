import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    hasTypeItemsCount = 0;
    /** --- 上下两端是否还有未显示的菜单项 --- */
    scrollStart = false;
    scrollEnd = false;
    access = {
        'scrollTimer': 0
    };
    /**
     * --- 根据实际溢出更新滚动提示，并关闭已偏离触发项的子菜单 ---
     * @param scrolled 是否由内容滚动触发
     * @returns void
     */
    refreshScroll(scrolled = false) {
        const body = this.refs.body;
        const max = body.scrollHeight - body.clientHeight;
        this.scrollStart = max > 1 && body.scrollTop > 1;
        this.scrollEnd = max > 1 && body.scrollTop < max - 1;
        if (scrolled) {
            const child = body.querySelector('[data-cg-pop-open]');
            if (child) {
                clickgo.form.hidePop(child);
            }
        }
    }
    /**
     * --- 按住边缘箭头滚动，不增加常驻帧任务 ---
     * @param event 指针事件
     * @param direction 向上或向下
     * @returns void
     */
    scrollDown(event, direction) {
        const body = this.refs.body;
        const step = direction === 'start' ? -5 : 5;
        this.stopScroll();
        body.scrollTop += step;
        clickgo.modules.pointer.down(event, {
            down: () => {
                this.access.scrollTimer = clickgo.task.onFrame(this, () => {
                    const pop = clickgo.dom.findParentByData(this.element, 'cg-pop');
                    if (!this.element.isConnected || (pop && pop.dataset.cgOpen === undefined)) {
                        this.stopScroll();
                        return;
                    }
                    body.scrollTop += step;
                });
            },
            up: () => {
                this.stopScroll();
            }
        });
    }
    /**
     * --- 停止边缘滚动，释放帧任务 ---
     * @returns void
     */
    stopScroll() {
        if (!this.access.scrollTimer) {
            return;
        }
        clickgo.task.offFrame(this, this.access.scrollTimer);
        this.access.scrollTimer = 0;
    }
    onMounted() {
        clickgo.dom.watchSize(this, this.refs.body, () => {
            this.refreshScroll();
        }, true);
        clickgo.dom.watchProperty(this.refs.body, 'scrollHeight', () => {
            this.refreshScroll();
        });
    }
    onBeforeUnmount() {
        this.stopScroll();
        clickgo.dom.unwatchSize(this.refs.body);
    }
}

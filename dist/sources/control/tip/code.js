import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'label': '',
        'maxwidth': 400,
        'class': '',
        'direction': 'top',
        'immediate': false,
        'type': 'default',
        'plain': false,
    };
    /** --- 鼠标在本体或 pop 里 --- */
    inTip = false;
    /** --- 绑定的目标元素 --- */
    bindEl = null;
    /** --- 进入事件 --- */
    enterHandler;
    /** --- 获取实际展示方向和坐标 --- */
    getPopPosition(el) {
        const pop = this.refs.pop;
        const bcr = el.getBoundingClientRect();
        const width = pop.offsetWidth;
        const height = pop.offsetHeight;
        const gap = 10;
        let direction = this.props.direction;
        let left = 0;
        let top = 0;
        const calcPosition = () => {
            switch (direction) {
                case 'right': {
                    left = bcr.left + bcr.width + gap;
                    top = bcr.top + bcr.height / 2 - height / 2;
                    break;
                }
                case 'bottom': {
                    left = bcr.left + bcr.width / 2 - width / 2;
                    top = bcr.top + bcr.height + gap;
                    break;
                }
                case 'left': {
                    left = bcr.left - width - gap;
                    top = bcr.top + bcr.height / 2 - height / 2;
                    break;
                }
                default: {
                    left = bcr.left + bcr.width / 2 - width / 2;
                    top = bcr.top - height - gap;
                }
            }
        };
        // --- 先按当前方向计算一次坐标，用于判断当前方向是否会出界 ---
        calcPosition();
        switch (direction) {
            case 'right': {
                if (left + width > window.innerWidth) {
                    direction = 'left';
                }
                break;
            }
            case 'bottom': {
                if (top + height > window.innerHeight) {
                    direction = 'top';
                }
                break;
            }
            case 'left': {
                if (left < 0) {
                    direction = 'right';
                }
                break;
            }
            default: {
                if (top < 0) {
                    direction = 'bottom';
                }
            }
        }
        // --- 若当前方向空间不足，则翻到对侧方向后重新计算一次最终坐标 ---
        calcPosition();
        if (left < 0) {
            left = 0;
        }
        else if (left + width > window.innerWidth) {
            left = Math.max(window.innerWidth - width, 0);
        }
        if (top < 0) {
            top = 0;
        }
        else if (top + height > window.innerHeight) {
            top = Math.max(window.innerHeight - height, 0);
        }
        return {
            'left': left,
            'top': top,
            'direction': direction,
        };
    }
    /** --- 更新提示位置 --- */
    updatePopPosition(el) {
        const pop = this.refs.pop;
        const position = this.getPopPosition(el);
        pop.dataset.tipDirection = position.direction;
        pop.style.left = position.left.toString() + 'px';
        pop.style.top = position.top.toString() + 'px';
    }
    /** --- 隐藏 tip --- */
    async hideTip() {
        this.inTip = false;
        if (this.propBoolean('immediate')) {
            clickgo.form.hidePop(this.refs.pop);
            return;
        }
        await clickgo.tool.sleep(150);
        if (this.inTip) {
            return;
        }
        clickgo.form.hidePop(this.refs.pop);
    }
    /** --- 获取初始定位方向 --- */
    getShowDirection() {
        switch (this.props.direction) {
            case 'right':
            case 'left': {
                return 'h';
            }
            case 'bottom': {
                return 'v';
            }
            default: {
                return 't';
            }
        }
    }
    /** --- tip pop 进入事件 --- */
    popEnter(e) {
        clickgo.modules.pointer.hover(e, {
            enter: () => {
                this.inTip = true;
            },
            leave: async () => {
                await this.hideTip();
            },
        });
    }
    /** --- 挂载后绑定前一个控件 --- */
    onMounted() {
        // --- 当前框架下直接用 display: contents 包裹 slot 会让相邻 tip 的边界变得不稳定，这里仍使用标记节点精确取当前 tip 的触发体 ---
        const el = this.refs.span.previousElementSibling;
        if (!el) {
            return;
        }
        this.bindEl = el;
        this.refs.span.remove();
        this.enterHandler = (e) => {
            clickgo.modules.pointer.hover(e, {
                enter: () => {
                    this.inTip = true;
                    clickgo.form.showPop(el, this.refs.pop, this.getShowDirection(), {
                        'flow': false
                    });
                    clickgo.tool.sleep(34).then(() => {
                        if (this.refs.pop.dataset.cgOpen === undefined) {
                            return;
                        }
                        this.updatePopPosition(el);
                    }).catch(() => {
                        // --- 忽略定位等待中止 ---
                    });
                },
                leave: async () => {
                    await this.hideTip();
                }
            });
        };
        el.addEventListener('pointerenter', this.enterHandler);
        el.addEventListener('pointerdown', this.enterHandler);
    }
    /** --- 卸载时移除事件绑定 --- */
    onUnmounted() {
        if (!this.bindEl || !this.enterHandler) {
            return;
        }
        this.bindEl.removeEventListener('pointerenter', this.enterHandler);
        this.bindEl.removeEventListener('pointerdown', this.enterHandler);
    }
}

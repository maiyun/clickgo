import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'load': null
    };
    props = {
        'gutter': '',
        'direction': '',
        'state': 'idle',
    };
    /** --- 总长度 --- */
    length = 0;
    /** --- 可见长度 --- */
    client = 0;
    /** --- 滚动偏移量 --- */
    offset = 0;
    /** --- 横向总宽度 --- */
    lengthh = 0;
    /** --- 横向可见宽度 --- */
    clienth = 0;
    /** --- 横向滚动偏移量 --- */
    offseth = 0;
    /** --- 供外部调用，滚动到底部 --- */
    toBottom() {
        this.refs.left.scrollTo({
            'top': this.refs.left.scrollHeight,
            'behavior': 'smooth',
        });
    }
    /** --- 检查是否触底，若满足条件则触发 load 事件 --- */
    checkLoad() {
        if (this.props.direction === 'h') {
            return;
        }
        if (this.props.state !== 'idle') {
            return;
        }
        const el = this.refs.left;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            this.emit('load');
        }
    }
    async down(e) {
        const el = e.target;
        if (el.dataset.cgEfno !== undefined || el.dataset.cgScroll !== undefined) {
            return;
        }
        if (clickgo.dom.findParentByData(el, 'cg-efno')) {
            return;
        }
        const scroll = clickgo.dom.findParentByData(el, 'cg-scroll');
        if (scroll && (scroll.dataset.cgControl !== this.controlName)) {
            return;
        }
        e.stopPropagation();
        clickgo.modules.pointer.move(e, {
            move: (e, detail) => {
                if (this.props.direction !== 'h') {
                    this.refs.left.scrollTop -= detail.oy;
                }
                if (this.props.direction !== 'v') {
                    this.refs.left.scrollLeft -= detail.ox;
                }
            }
        });
        await clickgo.form.doFocusAndPopEvent(e);
    }
    /** --- 纵向滚动条的滚动事件 --- */
    roll() {
        this.refs.left.scrollTop = this.offset;
    }
    /** --- 横向滚动条的滚动事件 --- */
    rollh() {
        this.refs.left.scrollLeft = this.offseth;
    }
    /** --- 滚动处理 --- */
    scrollHandler() {
        this.offset = this.refs.left.scrollTop;
        this.offseth = this.refs.left.scrollLeft;
        // --- 触底时触发加载事件 ---
        this.checkLoad();
    }
    onMounted() {
        // --- 容器大小改变 ---
        clickgo.dom.watchSize(this, this.refs.left, () => {
            this.client = this.refs.left.clientHeight;
            this.clienth = this.refs.left.clientWidth;
        }, true);
        // --- 内容大小改变 ---
        clickgo.dom.watchSize(this, this.refs.inner, () => {
            this.length = this.refs.inner.offsetHeight;
            this.lengthh = this.refs.inner.offsetWidth;
            // --- 内容未填满容器时自动触发加载 ---
            this.checkLoad();
        }, true);
    }
}

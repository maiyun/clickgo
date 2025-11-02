import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'gutter': '',
        };
        /** --- 总长度 --- */
        this.length = 0;
        /** --- 可见长度 --- */
        this.client = 0;
        /** --- 滚动偏移量 --- */
        this.offset = 0;
    }
    async down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const el = e.target;
        if (el.dataset.cgEfno !== undefined) {
            return;
        }
        if (clickgo.dom.findParentByData(el, 'cg-efno')) {
            return;
        }
        e.stopPropagation();
        clickgo.dom.bindMove(e, {
            'object': e.currentTarget,
            move: (e, o) => {
                this.refs.left.scrollTop -= o.oy;
            }
        });
        await clickgo.form.doFocusAndPopEvent(e);
    }
    roll() {
        this.refs.left.scrollTop = this.offset;
    }
    onMounted() {
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

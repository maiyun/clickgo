import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'gutter': '',
    };
    async down(e) {
        const el = e.target;
        if (el.dataset.cgEfno !== undefined) {
            return;
        }
        if (clickgo.dom.findParentByData(el, 'cg-efno')) {
            return;
        }
        e.stopPropagation();
        clickgo.modules.pointer.move(e, {
            'object': e.currentTarget,
            move: (e, o) => {
                this.refs.left.scrollTop -= o.oy;
            }
        });
        await clickgo.form.doFocusAndPopEvent(e);
    }
    /** --- 总长度 --- */
    length = 0;
    /** --- 可见长度 --- */
    client = 0;
    /** --- 滚动偏移量 --- */
    offset = 0;
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

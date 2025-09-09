import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'alt': ''
        };
    }
    enter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const length = clickgo.dom.siblingsData(this.element, 'cg-pop-open').length;
        if (length === 0) {
            // --- 别的没有展开，则不管 ---
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'null': true
        });
    }
    click() {
        if (this.element.dataset.cgPopOpen !== undefined) {
            // --- 本来是展开状态，就隐藏起来 ---
            clickgo.form.hidePop(this.refs.pop);
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'null': true
        });
    }
}

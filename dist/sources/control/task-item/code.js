import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'selected': false,
            'opened': false,
            'multi': false
        };
    }
    get isSelected() {
        return clickgo.tool.getBoolean(this.props.selected);
    }
    get isOpened() {
        return clickgo.tool.getBoolean(this.props.opened);
    }
    get isMulti() {
        return clickgo.tool.getBoolean(this.props.multi);
    }
    get position() {
        return this.parentByName('task')?.position ?? 'bottom';
    }
    click() {
        if (!this.slots['pop']) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v');
    }
    contextmenu(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.slots['contextmenu']) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.contextmenu, 'v');
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            // --- 是否要隐藏 ---
            if (e instanceof MouseEvent && e.button === 2) {
                // --- 点击鼠标右键 ---
                if (this.element.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
            else {
                if (this.refs.contextmenu?.dataset.cgOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                if (this.refs.pop?.dataset.cgOpen !== undefined) {
                    clickgo.form.hidePop();
                }
                clickgo.form.showPop(this.element, this.refs.contextmenu, 'v');
            });
        }
    }
}

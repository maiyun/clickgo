import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'selected': false,
        'opened': false,
        'multi': false
    };

    public get isSelected(): boolean {
        return clickgo.tool.getBoolean(this.props.selected);
    }

    public get isOpened(): boolean {
        return clickgo.tool.getBoolean(this.props.opened);
    }

    public get isMulti(): boolean {
        return clickgo.tool.getBoolean(this.props.multi);
    }

    public get position(): string {
        return this.parentByName('task')?.position ?? 'bottom';
    }

    public click(): void {
        if (!this.slots['pop']) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v');
    }

    public contextmenu(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.slots['contextmenu']) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.contextmenu, 'v');
    }

    public down(e: MouseEvent | TouchEvent): void {
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

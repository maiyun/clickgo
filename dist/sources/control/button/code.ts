import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'disabled': false,
        'plain': false,
        'checked': false,

        'type': 'default',
        'modelValue': undefined,

        'area': 'all'    // all, mark, arrow
    };

    public padding = '';

    public isKeyDown = false;

    public innerFocus = false;

    public arrowFocus = false;

    public get isDisabled(): boolean {
        return clickgo.tool.getBoolean(this.props.disabled);
    }

    public get isPlain(): boolean {
        return clickgo.tool.getBoolean(this.props.plain);
    }

    public get isChecked(): boolean {
        return clickgo.tool.getBoolean(this.props.checked);
    }

    public get isAreaAllMark(): boolean {
        return this.slots('pop').length > 0 ? (this.props.area === 'all' || this.props.area === 'mark') : true;
    }

    public get isChildFocus(): boolean {
        return this.innerFocus || this.arrowFocus;
    }

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    // --- methods ---

    public keydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.props.area === 'all' || this.props.area === 'mark') {
                this.innerClick(e);
                if (this.slots('pop').length === 0) {
                    this.element.click();
                }
            }
            else {
                if (this.innerFocus) {
                    this.innerClick(e);
                    this.element.click();
                }
                else {
                    this.arrowClick(e);
                }
            }
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    }

    public keyup(e: KeyboardEvent): void {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        if (this.props.area === 'all' || this.props.area === 'mark') {
            this.innerClick(e);
            if (!this.slots('pop').length) {
                this.element.click();
            }
        }
        else {
            if (this.innerFocus) {
                this.innerClick(e);
                this.element.click();
            }
            else {
                this.arrowClick(e);
            }
        }
    }

    public down(e: MouseEvent | TouchEvent): void {
        if (this.props.area !== 'mark') {
            return;
        }
        clickgo.dom.bindLong(e, () => {
            clickgo.form.showPop(this.refs.arrow, this.refs.pop, 'h');
        });
    }

    public innerClick(e: MouseEvent | KeyboardEvent): void {
        if (!this.slots('pop').length || (this.props.area === 'arrow' || this.props.area === 'mark')) {
            // --- 没有菜单，或者有菜单，但是只有点击 arrow 区域才会显示、隐藏 ---
            return;
        }
        // --- 全局模式，要显示/隐藏菜单 ---
        e.stopPropagation();
        // --- 检测是否显示 pop ---
        if (this.element.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.element, this.refs.pop, 'v');
        }
        else {
            clickgo.form.hidePop(this.element);
        }
    }

    public arrowClick(e: MouseEvent | KeyboardEvent): void {
        e.stopPropagation();
        if (this.props.area === 'all') {
            if (this.element.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.element, this.refs.pop, 'v');
            }
            else {
                clickgo.form.hidePop(this.element);
            }
        }
        else {
            if (this.refs.arrow.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.refs.arrow, this.refs.pop, this.props.area === 'arrow' ? 'v' : 'h');
            }
            else {
                clickgo.form.hidePop(this.refs.arrow);
            }
        }
    }

    public onMounted(): void | Promise<void> {
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
    }

}

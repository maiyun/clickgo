import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'plain': boolean | string;
        'checked': boolean | string;

        'type': 'default' | 'tool' | 'primary' | 'info' | 'warning' | 'danger';

        'area': 'all' | 'mark' | 'split';
    } = {
            'disabled': false,
            'plain': false,
            'checked': false,

            'type': 'default',

            'area': 'all'
        };

    /** --- watch 的外围 el 的 padding --- */
    public padding = '';

    /** --- 当前是否有键盘空格正在按下中 --- */
    public isSpaceDown = false;

    /** --- 按钮左侧获得焦点中 --- */
    public innerFocus = false;

    /** --- 按钮右侧获得焦点中 --- */
    public arrowFocus = false;

    /** --- 主标签(子标签为左右边栏)是否可获得焦点和操作（all / mark 模式可操作） --- */
    public get canDoMain(): boolean {
        return (this.props.area === 'all' || this.props.area === 'mark') ? true : false;
    }

    /** --- 左侧或者右侧正在有焦点 --- */
    public get isChildFocus(): boolean {
        return this.innerFocus || this.arrowFocus;
    }

    /** --- 外围 padding 的相反值 --- */
    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    // --- methods ---

    public keydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            // --- 回车 ---
            e.preventDefault();
            if (this.canDoMain) {
                // --- 在主标签响应 ---
                this.innerClick(e);
                if (!this.slots('pop').length || (this.props.area === 'mark')) {
                    // --- 没有菜单，或者有菜单但是是 mark 模式 ---
                    this.element.click();
                    if (this.refs.arrow.dataset.cgPopOpen !== undefined) {
                        clickgo.form.hidePop(this.refs.arrow);
                    }
                }
            }
            else {
                // --- 子标签响应 ---
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
            // --- 空格 ---
            e.preventDefault();
            if (this.isSpaceDown) {
                return;
            }
            this.isSpaceDown = true;
            if (this.props.area === 'mark') {
                // --- mark 模式长按弹出菜单 ---
                if (this.refs.arrow.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop(this.refs.arrow);
                }
                clickgo.tool.sleep(300).then(() => {
                    if (!this.isSpaceDown) {
                        return;
                    }
                    this.arrowClick(e);
                }).catch((e) => { console.log(e); });
            }
        }
    }

    public keyup(e: KeyboardEvent): void {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        if (this.canDoMain) {
            // --- 在主标签响应 ---
            if (this.refs.arrow.dataset.cgPopOpen !== undefined) {
                // --- 已经显示了 mark 的菜单，则此处不再响应事件 ---
                return;
            }
            this.innerClick(e);
            if (!this.slots('pop').length || (this.props.area === 'mark')) {
                // --- 没有菜单，或者有菜单但是是 mark 模式 ---
                this.element.click();
            }
        }
        else {
            // --- 子标签响应 ---
            if (this.innerFocus) {
                this.innerClick(e);
                this.element.click();
            }
            else {
                this.arrowClick(e);
            }
        }
    }

    // --- 鼠标按下事件 ---
    public down(e: MouseEvent | TouchEvent): void {
        if (this.props.area !== 'mark') {
            return;
        }
        // --- mark 才响应 ---
        clickgo.dom.bindLong(e, () => {
            clickgo.form.showPop(this.refs.arrow, this.refs.pop, 'h');
        });
    }

    // --- 左侧点击 ---
    public innerClick(e: MouseEvent | KeyboardEvent): void {
        if (!this.slots('pop').length || (this.props.area === 'split' || this.props.area === 'mark')) {
            // --- 没有菜单，或者有菜单，但是是分离或者 mark 模式，则不在左侧点击时响应事件 ---
            return;
        }
        // --- all 全局模式，要显示/隐藏菜单 ---
        e.stopPropagation();
        // --- 检测是否显示 pop ---
        if (this.element.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.element, this.refs.pop, 'v');
        }
        else {
            clickgo.form.hidePop(this.element);
        }
    }

    // --- 右侧点击 ---
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
            // --- mark / split ---
            if (this.refs.arrow.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.refs.arrow, this.refs.pop, this.props.area === 'split' ? 'v' : 'h');
            }
            else {
                clickgo.form.hidePop(this.refs.arrow);
            }
        }
    }

    public onMounted(): void {
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
    }

}

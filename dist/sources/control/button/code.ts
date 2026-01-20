import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'plain': boolean | string;
        'checked': boolean | string;

        'type': 'default' | 'tool' | 'primary' | 'info' | 'warning' | 'danger';
        'pointer': boolean | string;

        'area': 'all' | 'mark' | 'split';
        'size': 'm' | 'l' | 'xl';
        'sizeh': boolean | string;
        'gutter': number | string;
    } = {
            'disabled': false,
            'plain': false,
            'checked': false,

            'type': 'default',
            'pointer': false,

            'area': 'all',
            'size': 'm',
            'sizeh': false,
            'gutter': 0
        };

    /** --- 是否禁用状态 --- */
    public get isDisabled(): boolean {
        if (!this.inBgroup) {
            return this.propBoolean('disabled');
        }
        if (this.parent.disabled === undefined) {
            return this.propBoolean('disabled');
        }
        return (this.parent as any).propBoolean('disabled');
    }

    /** --- 是否朴素模式 --- */
    public get isPlain(): boolean {
        if (!this.inBgroup) {
            return this.propBoolean('plain');
        }
        if (this.parent.plain === undefined) {
            return this.propBoolean('plain');
        }
        return (this.parent as any).propBoolean('plain');
    }

    /** --- type --- */
    public get typeComp(): 'default' | 'tool' | 'primary' | 'info' | 'warning' | 'danger' {
        if (!this.inBgroup) {
            return this.props.type;
        }
        if (this.parent.type === undefined) {
            return this.props.type;
        }
        return (this.parent as any).props.type;
    }

    /** --- size --- */
    public get sizeComp(): 'm' | 'l' | 'xl' {
        if (!this.inBgroup) {
            return this.props.size;
        }
        if (this.parent.size === undefined) {
            return this.props.size;
        }
        return (this.parent as any).props.size;
    }

    /** --- 当前是否有键盘空格正在按下中 --- */
    public isSpaceDown = false;

    /** --- 按钮左侧获得焦点中 --- */
    public innerFocus = false;

    /** --- 按钮右侧获得焦点中 --- */
    public arrowFocus = false;

    /** --- 主标签(子标签为左右边栏)是否可获得焦点和操作（all / mark 模式可操作） --- */
    public get canDoMain(): boolean {
        return (this.props.area === 'all' || this.props.area === 'mark');
    }

    /** --- 左侧或者右侧正在有焦点 --- */
    public get isChildFocus(): boolean {
        return this.innerFocus || this.arrowFocus;
    }

    // --- methods ---

    public keydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            // --- 回车 ---
            e.preventDefault();
            if (this.canDoMain) {
                // --- 在主标签响应 ---
                this.innerClick(e);
                if (!this.slots['pop'] || (this.props.area === 'mark')) {
                    // --- 没有菜单，或者有菜单但是是 mark 模式 ---
                    this.element.click();
                    if (this.refs.arrow?.dataset.cgPopOpen !== undefined) {
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
                if (this.refs.arrow?.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop(this.refs.arrow);
                }
                clickgo.tool.sleep(300).then(() => {
                    if (!this.isSpaceDown) {
                        return;
                    }
                    this.arrowClick(e);
                }).catch(() => {
                    //
                });
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
            if (this.refs.arrow?.dataset.cgPopOpen !== undefined) {
                // --- 已经显示了 mark 的菜单，则此处不再响应事件 ---
                return;
            }
            this.innerClick(e);
            if (!this.slots['pop'] || (this.props.area === 'mark')) {
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

    // --- 按下事件 ---
    public down(oe: PointerEvent): void {
        if (this.props.area === 'mark') {
            // --- mark 才响应 ---
            clickgo.modules.pointer.long(oe, () => {
                clickgo.form.showPop(this.refs.arrow, this.refs.pop, 'h', {
                    'autoScroll': true,
                    'way': 'click'
                });
            });
        }
        if (this.propBoolean('pointer')) {
            this.doMove(oe);
        }
    }

    // --- 进入事件 ---
    public enter(oe: PointerEvent): void {
        if (!this.propBoolean('pointer')) {
            return;
        }
        this.doMove(oe);
    }

    public doMove(oe: PointerEvent): void {
        clickgo.modules.pointer.hover(oe, {
            enter: e => {
                const rect = this.element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.element.style.setProperty('--pointer-x', x + 'px');
                this.element.style.setProperty('--pointer-y', y + 'px');
                this.refs.pointer.style.opacity = '1';
            },
            move: e => {
                const rect = this.element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.element.style.setProperty('--pointer-x', x + 'px');
                this.element.style.setProperty('--pointer-y', y + 'px');
            },
            leave: () => {
                this.refs.pointer.style.opacity = '0';
            }
        });
    }

    // --- 左侧点击 ---
    public innerClick(e: MouseEvent | KeyboardEvent): void {
        if (!this.slots['pop'] || (this.props.area === 'split' || this.props.area === 'mark')) {
            // --- 没有菜单，或者有菜单，但是是分离或者 mark 模式，则不在左侧点击时响应事件 ---
            return;
        }
        // --- all 全局模式，要显示/隐藏菜单 ---
        e.stopPropagation();
        // --- 检测是否显示 pop ---
        if (this.element.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.element, this.refs.pop, 'v', {
                'autoScroll': true,
                'way': 'click'
            });
        }
        else {
            // clickgo.form.hidePop(this.element);
        }
    }

    // --- 右侧点击 ---
    public arrowClick(e: MouseEvent | KeyboardEvent): void {
        e.stopPropagation();
        if (this.props.area === 'all') {
            if (this.element.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.element, this.refs.pop, 'v', {
                    'autoScroll': true,
                    'way': 'click'
                });
            }
            else {
                // clickgo.form.hidePop(this.element);
            }
        }
        else {
            // --- mark / split ---
            if (this.refs.arrow?.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.refs.arrow, this.refs.pop, this.props.area === 'split' ? 'v' : 'h', {
                    'autoScroll': true,
                    'way': 'click'
                });
            }
            else {
                // clickgo.form.hidePop(this.refs.arrow);
            }
        }
    }

    /** --- 当前是第几列，从 0 开始 --- */
    public index: number = 0;

    /** --- 是否在按钮贴贴内部 --- */
    public inBgroup = false;

    /** --- 当前按钮在贴贴的位置 --- */
    public get bgroupPos(): 'first' | 'center' | 'end' | '' {
        if (!this.inBgroup) {
            return '';
        }
        if (this.index === 0) {
            // --- 第一个 ---
            if (this.parent.itemsLength === 1) {
                // --- 只有一个 ---
                return '';
            }
            return 'first';
        }
        if (this.parent.itemsLength === this.index + 1) {
            // --- 最后一个 ---
            return 'end';
        }
        // --- 中间 ---
        return 'center';
    }

    public onMounted(): void {
        if (this.parent.controlName === 'bgroup') {
            this.inBgroup = true;
            this.index = clickgo.dom.index(this.element);
            ++this.parent.itemsLength;
            this.watch(() => {
                return this.parent.itemsLength;
            }, () => {
                this.index = clickgo.dom.index(this.element);
            });
        }
    }

    public onUnmounted(): void | Promise<void> {
        if (this.parent.controlName === 'bgroup') {
            --this.parent.itemsLength;
        }
    }

}

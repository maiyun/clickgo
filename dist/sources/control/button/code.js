import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
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
    get isDisabled() {
        if (!this.inBgroup) {
            return this.propBoolean('disabled');
        }
        if (this.parent.disabled === undefined) {
            return this.propBoolean('disabled');
        }
        return this.parent.propBoolean('disabled');
    }
    /** --- 是否朴素模式 --- */
    get isPlain() {
        if (!this.inBgroup) {
            return this.propBoolean('plain');
        }
        if (this.parent.plain === undefined) {
            return this.propBoolean('plain');
        }
        return this.parent.propBoolean('plain');
    }
    /** --- type --- */
    get typeComp() {
        if (!this.inBgroup) {
            return this.props.type;
        }
        if (this.parent.type === undefined) {
            return this.props.type;
        }
        return this.parent.props.type;
    }
    /** --- size --- */
    get sizeComp() {
        if (!this.inBgroup) {
            return this.props.size;
        }
        if (this.parent.size === undefined) {
            return this.props.size;
        }
        return this.parent.props.size;
    }
    /** --- 当前是否有键盘空格正在按下中 --- */
    isSpaceDown = false;
    /** --- 按钮左侧获得焦点中 --- */
    innerFocus = false;
    /** --- 按钮右侧获得焦点中 --- */
    arrowFocus = false;
    /** --- 主标签(子标签为左右边栏)是否可获得焦点和操作（all / mark 模式可操作） --- */
    get canDoMain() {
        return (this.props.area === 'all' || this.props.area === 'mark');
    }
    /** --- 左侧或者右侧正在有焦点 --- */
    get isChildFocus() {
        return this.innerFocus || this.arrowFocus;
    }
    // --- methods ---
    keydown(e) {
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
    keyup(e) {
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
    down(oe) {
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
    enter(oe) {
        if (!this.propBoolean('pointer')) {
            return;
        }
        this.doMove(oe);
    }
    doMove(oe) {
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
    innerClick(e) {
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
    arrowClick(e) {
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
    index = 0;
    /** --- 是否在按钮贴贴内部 --- */
    inBgroup = false;
    /** --- 当前按钮在贴贴的位置 --- */
    get bgroupPos() {
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
    onMounted() {
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
    onUnmounted() {
        if (this.parent.controlName === 'bgroup') {
            --this.parent.itemsLength;
        }
    }
}

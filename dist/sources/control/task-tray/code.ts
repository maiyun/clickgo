import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'icon': string;
        'tip': string;
        'menu': clickgo.task.ITrayMenuItem[];
    } = {
            'icon': '',
            'tip': '',
            'menu': []
        };

    public emits = {
        'activate': null,
        'menu': null
    };

    /**
     * --- 键盘激活和上下文菜单；Escape 由公共浮层处理 ---
     * @param e 键盘事件
     * @returns 无返回值
     */
    public keydown(e: KeyboardEvent): void {
        if (e.repeat || e.isComposing) {
            return;
        }
        if ((e.key === 'Enter') || (e.key === ' ')) {
            e.preventDefault();
            clickgo.form.hidePop();
            this.emit('activate');
        }
        else if ((e.key === 'ContextMenu') || ((e.key === 'F10') && e.shiftKey)) {
            if (!this.slots['contextmenu'] && !this.props.menu.length) {
                return;
            }
            e.preventDefault();
            clickgo.form.showPop(this.element, this.refs.pop, 'v');
        }
    }

    /**
     * --- 左键激活、右键或触摸长按打开菜单 ---
     * @param e 指针事件
     * @returns 无返回值
     */
    public down(e: PointerEvent): void {
        e.stopPropagation();
        clickgo.modules.pointer.menu(e, () => {
            if (!this.slots['contextmenu'] && !this.props.menu.length) {
                return;
            }
            if (this.element.dataset.cgPopOpen !== undefined) {
                clickgo.form.hidePop();
                return;
            }
            clickgo.form.showPop(this.element, this.refs.pop, e);
        });
        clickgo.modules.pointer.click(e, () => {
            clickgo.form.hidePop();
            this.emit('activate');
        });
    }

    /**
     * --- 仅发送可用的菜单命令，由应用决定如何执行 ---
     * @param item 菜单项
     * @returns 无返回值
     */
    public select(item: clickgo.task.ITrayMenuItem): void {
        if (item.disabled || item.separator) {
            return;
        }
        clickgo.form.hidePop();
        this.emit('menu', { 'detail': { 'id': item.id } });
    }

    /**
     * --- 数据更新后关闭旧菜单，避免显示过期命令 ---
     * @returns 无返回值
     */
    public onMounted(): void {
        this.watch('menu', () => {
            if (this.element.dataset.cgPopOpen !== undefined) {
                clickgo.form.hidePop();
            }
        }, { 'deep': true });
    }

    /**
     * --- 移除托盘时关闭所属浮层 ---
     * @returns 无返回值
     */
    public onBeforeUnmount(): void {
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
    }

}

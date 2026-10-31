import * as clickgo from 'clickgo';
import type Accordion from '../accordion/code';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- 同一 Accordion 内唯一且非空的标识 --- */
        'name': string;
        /** --- 标题默认文字 --- */
        'label': string;
        /** --- 禁止用户操作当前项 --- */
        'disabled': boolean | string;
    } = {
            'name': '',
            'label': '',
            'disabled': false,
        };

    /** --- 所属 Accordion --- */
    public accordion: Accordion | null = null;

    /** --- 关联标题与面板的唯一 ID --- */
    public id = '';

    /** --- 空格按下后等待释放 --- */
    public isSpaceDown = false;

    /** --- 当前项是否禁止操作 --- */
    public get isDisabled(): boolean {
        return !this.accordion || !this.props.name || this.propBoolean('disabled') || this.accordion.propBoolean('disabled');
    }

    /** --- 当前项是否展开 --- */
    public get expanded(): boolean {
        return !!this.props.name && (this.accordion?.value.includes(this.props.name) ?? false);
    }

    /**
     * --- 面板收起时将其中的焦点移回标题 ---
     * @returns 焦点处理完成
     */
    public restoreFocus(): void {
        if (this.refs.panel?.contains(document.activeElement)) {
            this.refs.trigger?.focus();
        }
    }

    /**
     * --- 切换当前项 ---
     * @returns 切换处理完成
     */
    public toggle(): void {
        if (!this.isDisabled) {
            this.accordion?.toggle(this);
        }
    }

    /**
     * --- 处理键盘激活及标题导航 ---
     * @param event 按键事件
     * @returns 处理完成
     */
    public keydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (event.repeat || event.isComposing || this.isDisabled) {
                return;
            }
            if (event.key === 'Enter') {
                this.toggle();
            }
            else {
                this.isSpaceDown = true;
            }
            return;
        }
        if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) && !this.isDisabled) {
            event.preventDefault();
            this.accordion?.move(this, event.key);
        }
    }

    /**
     * --- 释放空格时激活 ---
     * @param event 按键事件
     * @returns 处理完成
     */
    public keyup(event: KeyboardEvent): void {
        if (event.key !== ' ' || !this.isSpaceDown) {
            return;
        }
        event.preventDefault();
        this.isSpaceDown = false;
        this.toggle();
    }

    /**
     * --- 外部状态收起面板前保留焦点 ---
     * @returns 状态校正完成
     */
    public onBeforeUpdate(): void {
        if (!this.expanded) {
            this.restoreFocus();
        }
        if (this.isDisabled) {
            this.isSpaceDown = false;
        }
    }

    /**
     * --- 关联直属父控件 ---
     * @returns 注册完成
     */
    public onMounted(): void {
        const accordion = this.parentByName('accordion') as Accordion | null;
        if (accordion?.refs.list === this.element.parentElement) {
            this.accordion = accordion;
            accordion.register(this);
        }
    }

    /**
     * --- 注销父控件引用 ---
     * @returns 注销完成
     */
    public onBeforeUnmount(): void {
        this.accordion?.unregister(this);
        this.accordion = null;
    }

}

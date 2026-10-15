import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    /** --- 应用模板的 @click 由框架统一转换为 tap --- */
    public emits = { 'tap': null };

    public props: {
        /** --- grow，是否占用状态栏中的剩余空间 --- */
        'grow': boolean | string;
        /** --- type，当前状态项使用的语义颜色类型 --- */
        'type': 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg';
        /** --- clickable，整项作为可操作入口，默认 false --- */
        'clickable': boolean | string;
        /** --- disabled，禁用可操作项的点击及键盘激活 --- */
        'disabled': boolean | string;
    } = {
            'grow': false,
            'type': 'default',
            'clickable': false,
            'disabled': false,
        };

    /** --- 空格按下后显示激活状态，释放时才执行 --- */
    public isSpaceDown = false;

    /**
     * --- 鼠标及键盘共用激活通知，保留原事件供框架检查 ---
     * @param event 鼠标或键盘事件
     * @returns 无；普通项及禁用项不激活
     */
    public activate(event: MouseEvent | KeyboardEvent): void {
        if (!this.propBoolean('clickable') || this.propBoolean('disabled')) {
            return;
        }
        this.emit('tap', event);
    }

    /**
     * --- 回车激活，空格等待释放，阻止空格滚动页面 ---
     * @param event 键盘事件
     * @returns 无
     */
    public keydown(event: KeyboardEvent): void {
        if (!this.formFocus || !this.propBoolean('clickable') || this.propBoolean('disabled')) {
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!event.repeat) {
                this.activate(event);
            }
        }
        else if (event.key === ' ') {
            event.preventDefault();
            this.isSpaceDown = true;
        }
    }

    /**
     * --- 空格释放时激活；失焦后释放不再执行 ---
     * @param event 键盘事件
     * @returns 无
     */
    public keyup(event: KeyboardEvent): void {
        if (event.key !== ' ' || !this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        if (this.formFocus && this.propBoolean('clickable') && !this.propBoolean('disabled')) {
            this.activate(event);
        }
    }

}
